import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RoutineTask } from 'src/components/models';
import { routineService } from 'src/services';

const getLocalDateString = (isoString: string | Date) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useRoutineStore = defineStore('routine', () => {
  const tasks = ref<RoutineTask[]>([]);
  const isLoading = ref(false);

  const activeFilters = ref({
    search: '',
    platform: '',
    createdAt: '',
    updatedAt: '',
    sortBy: 'manual'
  });

  const filteredTasks = computed(() => {
    const result = tasks.value.filter(task => {
      if (activeFilters.value.search) {
        const term = activeFilters.value.search.toLowerCase().trim();
        const checklistTexts = task.checklist.map(c => c.label).join(' ');
        const everything = `${task.title} ${task.instructions} ${task.mediaUrl} ${checklistTexts}`.toLowerCase();
        if (!everything.includes(term)) return false;
      }
      if (activeFilters.value.platform && activeFilters.value.platform !== '') {
        if (task.platform !== activeFilters.value.platform) return false;
      }
      if (activeFilters.value.createdAt && task.createdAt) {
        if (getLocalDateString(task.createdAt) !== activeFilters.value.createdAt) return false;
      }
      if (activeFilters.value.updatedAt && task.updatedAt) {
        if (getLocalDateString(task.updatedAt) !== activeFilters.value.updatedAt) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (activeFilters.value.sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (activeFilters.value.sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (activeFilters.value.sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      return ((a as any).order || 0) - ((b as any).order || 0);
    });

    return result;
  });

  const fetchTasks = async () => {
    isLoading.value = true;
    try {
      tasks.value = await routineService.getAll();
    } catch (error) {
      console.error('Erro ao buscar rotinas:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const addTask = async (newTaskData: Omit<RoutineTask, 'id'>) => {
    try {
      isLoading.value = true;

      const newOrder = tasks.value.length + 1;
      const createdTask = await routineService.create({ ...newTaskData, order: newOrder });
      tasks.value.push(createdTask);
    } catch (error) {
      console.error('Erro ao criar rotina:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateTask = async (updatedTask: RoutineTask) => {
    try {
      await routineService.update(updatedTask);
      const index = tasks.value.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) tasks.value[index] = updatedTask;
    } catch (error) {
      console.error('Falha ao atualizar tarefa:', error);
      throw error;
    }
  };

  const updateTasksOrder = async (reorderedTasks: RoutineTask[]) => {
    try {
      const updatedList = reorderedTasks.map((task, index) => {
        task.order = index + 1;
        return task;
      });
      tasks.value = updatedList;
      await Promise.all(updatedList.map(task => routineService.update(task)));
    } catch (error) {
      console.error('Erro ao reordenar:', error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await routineService.delete(id);
      const reordered = tasks.value
        .filter(task => task.id !== id)
        .map((task, index) => ({ ...task, order: index + 1 }));
      tasks.value = reordered;
      await updateTasksOrder(reordered);
    } catch (error) {
      console.error('Erro ao deletar rotina:', error);
    }
  };

  return {
    tasks,
    isLoading,
    activeFilters,
    filteredTasks,
    fetchTasks,
    addTask,
    updateTask,
    updateTasksOrder,
    removeTask
  };
});
