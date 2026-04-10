import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RoutineTask } from 'src/components/models';
import { routineService } from 'src/services';

export const useRoutineStore = defineStore('routine', () => {
  // --- STATE ---
  const tasks = ref<RoutineTask[]>([]);
  const isLoading = ref(false);

  // Novo estado: Os filtros ativos agora moram aqui!
  const activeFilters = ref({
    search: '',
    platform: '',
    createdAt: '',
    updatedAt: '',
    sortBy: 'manual',
  });

  // --- GETTERS (Computed Properties) ---

  const isRoutineComplete = computed(() => {
    return (
      tasks.value.length > 0 &&
      tasks.value.every((task) => task.checklist.every((item) => item.done))
    );
  });

  const getLocalDateString = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0'); // getDate() pega o dia no fuso local!
    return `${year}-${month}-${day}`;
  };

  const filteredTasks = computed(() => {
    // 1. PRIMEIRO: Filtramos os resultados
    let result = tasks.value.filter((task) => {
      if (activeFilters.value.search) {
        const term = activeFilters.value.search.toLowerCase().trim();
        const checklistTexts = task.checklist.map((c) => c.label).join(' ');
        const everything =
          `${task.title} ${task.instructions} ${task.mediaUrl} ${checklistTexts}`.toLowerCase();
        if (!everything.includes(term)) return false;
      }

      if (activeFilters.value.platform && activeFilters.value.platform !== '') {
        if (task.platform !== activeFilters.value.platform) return false;
      }

      if (activeFilters.value.createdAt && task.createdAt) {
        const taskCreateDay = getLocalDateString(task.createdAt);
        if (taskCreateDay !== activeFilters.value.createdAt) return false;
      }

      if (activeFilters.value.updatedAt && task.updatedAt) {
        const taskUpdateDay = getLocalDateString(task.updatedAt);
        if (taskUpdateDay !== activeFilters.value.updatedAt) return false;
      }

      return true;
    });

    // 2. SEGUNDO: Ordenamos os resultados filtrados
    result.sort((a, b) => {
      if (activeFilters.value.sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }

      if (activeFilters.value.sortBy === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }

      if (activeFilters.value.sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }

      if (activeFilters.value.sortBy === 'reverse-alphabetical') {
        return b.title.localeCompare(a.title);
      }

      return (a.order || 0) - (b.order || 0);
    });

    return result;
  });

  // --- ACTIONS ---

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
      const newOrder = tasks.value.length + 1;
      const createdTask = await routineService.create({ ...newTaskData, order: newOrder });
      tasks.value.push(createdTask);
    } catch (error) {
      console.error('Erro ao criar rotina:', error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await routineService.delete(id);
      tasks.value = tasks.value.filter((task) => task.id !== id);
    } catch (error) {
      console.error('Erro ao deletar rotina:', error);
    }
  };

  const updateTask = async (updatedTask: RoutineTask) => {
    try {
      await routineService.update(updatedTask);
      const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
    } catch (error) {
      console.error('Erro ao atualizar rotina:', error);
    }
  };

  const updateTasksOrder = async (reorderedTasks: RoutineTask[]) => {
    try {
      // 1. Atualiza a numeração de cada card localmente baseado na nova posição
      const updatedList = reorderedTasks.map((task, index) => {
        task.order = index + 1;
        return task;
      });

      // 2. Atualiza a tela instantaneamente
      tasks.value = updatedList;

      // 3. Salva a nova ordem de cada card no Firebase paralelamente
      await Promise.all(updatedList.map((task) => routineService.update(task)));
      console.log('✅ Ordem atualizada no banco de dados!');
    } catch (error) {
      console.error('Erro ao reordenar:', error);
    }
  };

  const finishRoutineAction = async () => {
    isLoading.value = true;
    try {
      await Promise.all(tasks.value.map((task) => routineService.update(task)));
      console.log('🎉 Treino salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o treino:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    activeFilters,
    filteredTasks,
    tasks,
    isLoading,
    isRoutineComplete,
    fetchTasks,
    addTask,
    removeTask,
    updateTask,
    updateTasksOrder,
    finishRoutineAction,
  };
});
