<template>
  <div>
    <draggable
      v-model="localTasks"
      item-key="id"
      class="row q-col-gutter-lg justify-center"
      handle=".drag-handle"
      ghost-class="ghost-card"
      animation="200"
      :disabled="isDragDisabled || readOnly"
      @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div
          class="col-12 col-md-8 col-lg-6 q-mb-lg"
          :ref="(el) => setCardRef(el, index)"
        >
          <RoutineCard
            :readOnly="readOnly"
            :task="element"
            :totalTasks="tasks.length"
            @edit="openEditModal"
            @delete="openDeleteModal"
            @duplicate="openDuplicateModal"
          />
        </div>
      </template>

      <template #footer>
        <div
          v-if="!readOnly"
          class="col-12 col-md-8 col-lg-6 q-mb-lg add-card-wrapper"
          ref="addCardWrapperRef"
        >
          <RoutineAdd @click="openCreateModal" />
        </div>
      </template>
    </draggable>

    <RoutineForm
    v-if="!readOnly"
    v-model="isDialogOpen" @saved="onTaskSaved" :task-to-edit="selectedTask" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import draggable from 'vuedraggable'; // Biblioteca de arrastar e soltar
import gsap from 'gsap';
import RoutineCard from 'src/components/RoutineCard.vue';
import RoutineAdd from 'src/components/RoutineAdd.vue';
import RoutineForm from 'src/components/RoutineForm.vue';
import { RoutineTask } from 'src/components/models';
import { useRoutineStore } from 'src/stores/routine-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

const props = defineProps<{
  tasks: RoutineTask[];
  readOnly: boolean;
}>();

const cardsRefs = ref<HTMLElement[]>([]);
const addCardWrapperRef = ref<HTMLElement | null>(null);
const isDialogOpen = ref(false);
const selectedTask = ref<RoutineTask | null>(null);

const routineStore = useRoutineStore();
const { activeFilters } = storeToRefs(routineStore); // Necessário para a trava de segurança do drag
const $q = useQuasar();

// --- LÓGICA DO DRAG AND DROP ---

// O draggable precisa de um array mutável local para não quebrar o Vue
const localTasks = ref<RoutineTask[]>([]);

// Mantém o array local sincronizado com a prop
watch(() => props.tasks, (newTasks) => {
  localTasks.value = [...newTasks];
}, { immediate: true, deep: true });

// Bloqueia o arrastar se a tela estiver filtrada ou ordenada diferente de "Manual"
const isDragDisabled = computed(() => {
  return activeFilters.value.search !== '' ||
         activeFilters.value.platform !== '' ||
         activeFilters.value.sortBy !== 'manual';
});

// Ação disparada ao soltar o card
const onDragEnd = async () => {
  await routineStore.updateTasksOrder(localTasks.value);
};


// --- LÓGICA DE MODAIS ---

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
    title: props.readOnly ? 'Adicionar Rotina' : 'Duplicar Rotina',
    message: `Deseja criar uma nova tarefa baseada em "${task.title}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    const { id, createdAt, updatedAt, order, ...taskData } = task; // Retiramos o order também para ir pro final da lista
    routineStore.addTask({
      ...taskData,
      title: `${task.title} (Cópia)`,
    });
  });
};


// --- ANIMAÇÕES (GSAP) ---

const setCardRef = (componentInstance: any, index: number) => {
  if (componentInstance) {
    cardsRefs.value[index] = componentInstance.$el || componentInstance;
  }
};

// Observa as tasks para a animação inicial de entrada
watch(() => props.tasks, async (newTasks) => {
  if (newTasks.length > 0) {
    await nextTick();

    // Limpa refs indefinidos para evitar erros no GSAP
    const validCardsRefs = cardsRefs.value.filter(el => el !== null && el !== undefined);

    const allElementsToAnimate = [...validCardsRefs];
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

// Feedback visual extra quando salva uma nova tarefa
const onTaskSaved = () => {
  console.log('Nova rotina injetada com sucesso!');
};
</script>

<style scoped>
.add-card-wrapper {
  /* Garante que o card pontilhado acompanhe a altura do conteúdo se necessário */
  display: flex;
  flex-direction: column;
}

/* Classe aplicada visualmente ao card enquanto ele está flutuando (sendo arrastado) */
.ghost-card {
  opacity: 0.4;
  filter: brightness(0.9);
  border: 2px dashed var(--q-primary);
  border-radius: 16px;
}
</style>
