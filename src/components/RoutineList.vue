<template>
  <div>
    <div class="row q-col-gutter-lg justify-center">

      <div
        v-for="(task, index) in tasks"
        :key="task.id"
        class="col-12 col-md-8 col-lg-6 q-mb-lg"
        :ref="(el) => setCardRef(el, index)"
      >
        <RoutineCard :task="task" @edit="openEditModal" @delete="openDeleteModal" @duplicate="openDuplicateModal" />
      </div>

      <div
        class="col-12 col-md-8 col-lg-6 q-mb-lg add-card-wrapper"
        ref="addCardWrapperRef"
      >
        <RoutineAdd @click="openCreateModal" />
      </div>

    </div>

    <RoutineForm v-model="isDialogOpen" @saved="onTaskSaved" :task-to-edit="selectedTask" />

  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import gsap from 'gsap';
import RoutineCard from 'src/components/RoutineCard.vue';
import RoutineAdd from 'src/components/RoutineAdd.vue';
import RoutineForm from 'src/components/RoutineForm.vue';
import { RoutineTask } from 'src/components/models';
import { useRoutineStore } from 'src/stores/routine-store';
import { useQuasar } from 'quasar';

const props = defineProps<{
  tasks: RoutineTask[];
}>();

const cardsRefs = ref<HTMLElement[]>([]);
const addCardWrapperRef = ref<HTMLElement | null>(null);
const isDialogOpen = ref(false);
const selectedTask = ref<RoutineTask | null>(null);
const routineStore = useRoutineStore();
const $q = useQuasar();
const openCreateModal = () => {
  selectedTask.value = null; // Garante que está vazio para criar
  isDialogOpen.value = true;
};

const openEditModal = (task: RoutineTask) => {
  selectedTask.value = task; // Preenche para editar
  console.log('Editando tarefa:', task);
  isDialogOpen.value = true;
};

const openDeleteModal = (task: RoutineTask) => {
  $q.dialog({
    title: 'Confirmar Deleção',
    message: `Tem certeza que deseja deletar a tarefa "${task.title}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    routineStore.removeTask(task.id);
  });
};


const openDuplicateModal = (task: RoutineTask) => {
  $q.dialog({
    title: 'Confirmar duplicação',
    message: `Deseja criar uma nova tarefa baseada em "${task.title}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    const { id, createdAt, updatedAt, ...taskData } = task;
    routineStore.addTask({
      ...taskData,
      title: `${task.title} (Cópia)`,
    });
  });
};


const setCardRef = (componentInstance: any, index: number) => {
  if (componentInstance) {
    cardsRefs.value[index] = componentInstance.$el || componentInstance;
  }
};

// Observa as tasks para a animação inicial de entrada
watch(() => props.tasks, async (newTasks) => {
  if (newTasks.length > 0) {
    await nextTick();

    // Array com todos os cards normais + o card pontilhado de adicionar
    const allElementsToAnimate = [...cardsRefs.value];
    if (addCardWrapperRef.value) {
      allElementsToAnimate.push(addCardWrapperRef.value);
    }

    gsap.from(allElementsToAnimate, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'back.out(1.2)',
      delay: 0.3
    });
  }
}, { immediate: true });

// Opcional: Feedback visual extra quando salva uma nova tarefa
const onTaskSaved = () => {
  console.log('Nova rotina injetada com sucesso!');
  // A store já atualizou a reatividade, então o novo card vai aparecer automaticamente.
};
</script>

<style scoped>
.add-card-wrapper {
  /* Garante que o card pontilhado acompanhe a altura do conteúdo se necessário */
  display: flex;
  flex-direction: column;
}
</style>
