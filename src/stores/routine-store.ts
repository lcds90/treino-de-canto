import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RoutineTask } from 'src/components/models';
import { routineService } from 'src/services';

export const useRoutineStore = defineStore('routine', () => {
  const tasks = ref<RoutineTask[]>([]);
  const isLoading = ref(false);

  const isRoutineComplete = computed(() => {
    return tasks.value.length > 0 && tasks.value.every(task =>
      task.checklist.every(item => item.done)
    );
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
      const createdTask = await routineService.create(newTaskData);
      tasks.value.push(createdTask);
    } catch (error) {
      console.error('Erro ao criar rotina:', error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await routineService.delete(id);
      tasks.value = tasks.value.filter(task => task.id !== id);
    } catch (error) {
      console.error('Erro ao deletar rotina:', error);
    }
  };

  const updateTask = async (updatedTask: RoutineTask) => {
    try {
      await routineService.update(updatedTask);
      const index = tasks.value.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
    } catch (error) {
      console.error('Erro ao atualizar rotina:', error);
    }
  }

  const finishRoutineAction = async () => {
    isLoading.value = true;
    try {
      await Promise.all(
        tasks.value.map(task => routineService.update(task))
      );
      console.log('🎉 Treino salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o treino:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    tasks,
    isLoading,
    isRoutineComplete,
    fetchTasks,
    addTask,
    removeTask,
    updateTask,
    finishRoutineAction
  };
});
