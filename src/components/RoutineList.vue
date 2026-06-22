<template>
  <div>
    <!-- Empty State -->
    <div v-if="tasks.length === 0 && !readOnly" class="row justify-center q-mb-xl">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card class="empty-state-card text-center q-pa-xl shadow-6 bg-glass">
          <q-card-section>
            <div class="icon-container q-mb-md">
              <q-icon name="music_note" size="5rem" color="secondary" class="float-animation" />
            </div>
            <h2 class="text-h5 text-weight-bold text-primary q-mt-none q-mb-sm">Monte sua Rotina de Canto! 🎙️</h2>
            <p class="text-body1 text-grey-7 q-mb-xl">
              Sua lista de exercícios está vazia. Você pode adicionar lições manualmente, usar o nosso <strong>Kit Inicial</strong> ou explorar o acervo completo.
            </p>
            
            <div class="row q-col-gutter-md justify-center">
              <div class="col-12 col-sm-6">
                <q-btn
                  color="primary"
                  icon="auto_awesome"
                  label="Importar Kit Inicial"
                  :loading="importingKit"
                  @click="handleImportKit"
                  class="full-width text-weight-bold q-py-sm shadow-3"
                >
                  <q-tooltip>Adiciona 4 exercícios básicos essenciais</q-tooltip>
                </q-btn>
              </div>
              <div class="col-12 col-sm-6">
                <q-btn
                  color="secondary"
                  outline
                  icon="library_books"
                  label="Explorar Biblioteca"
                  @click="openLibraryModal"
                  class="full-width text-weight-bold q-py-sm border-2"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Lista Draggable de Cartões -->
    <draggable
      v-else
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

      <!-- Rodapé da lista com as opções de inserção de tarefas -->
      <template #footer>
        <div v-if="!readOnly" class="col-12 col-md-8 col-lg-6 q-mb-lg" style="display: contents;">
          <div class="col-12 col-md-8 col-lg-6 q-mb-lg add-card-wrapper" ref="addCardWrapperRef">
            <RoutineAdd @click="openCreateModal" />
          </div>
          <div class="col-12 col-md-8 col-lg-6 q-mb-lg add-card-wrapper" ref="libraryCardWrapperRef">
            <RoutineLibraryCard @click="openLibraryModal" />
          </div>
        </div>
      </template>
    </draggable>

    <!-- Formulário manual de tarefas -->
    <RoutineForm
      v-if="!readOnly"
      v-model="isDialogOpen"
      @saved="onTaskSaved"
      :task-to-edit="selectedTask"
    />

    <!-- Catálogo de Importação do Acervo -->
    <LibraryCatalogDialog
      v-if="!readOnly"
      v-model="isLibraryOpen"
      @imported="onTaskSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import draggable from 'vuedraggable';
import gsap from 'gsap';
import RoutineCard from 'src/components/RoutineCard.vue';
import RoutineAdd from 'src/components/RoutineAdd.vue';
import RoutineLibraryCard from 'src/components/RoutineLibraryCard.vue';
import RoutineForm from 'src/components/RoutineForm.vue';
import LibraryCatalogDialog from 'src/components/LibraryCatalogDialog.vue';
import type { RoutineTask } from 'src/components/models';
import { useRoutineStore } from 'src/stores/routine-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

const props = defineProps<{
  tasks: RoutineTask[];
  readOnly: boolean;
}>();

const cardsRefs = ref<HTMLElement[]>([]);
const addCardWrapperRef = ref<HTMLElement | null>(null);
const libraryCardWrapperRef = ref<HTMLElement | null>(null);

const isDialogOpen = ref(false);
const isLibraryOpen = ref(false);
const selectedTask = ref<RoutineTask | null>(null);
const importingKit = ref(false);

const routineStore = useRoutineStore();
const { activeFilters } = storeToRefs(routineStore);
const $q = useQuasar();

// --- LÓGICA DO DRAG AND DROP ---
const localTasks = ref<RoutineTask[]>([]);

watch(() => props.tasks, (newTasks) => {
  localTasks.value = [...newTasks];
}, { immediate: true, deep: true });

const isDragDisabled = computed(() => {
  return activeFilters.value.search !== '' ||
         activeFilters.value.platform !== '' ||
         activeFilters.value.sortBy !== 'manual';
});

const onDragEnd = async () => {
  await routineStore.updateTasksOrder(localTasks.value);
};

// --- LÓGICA DE MODAIS ---
const openCreateModal = () => {
  selectedTask.value = null;
  isDialogOpen.value = true;
};

const openLibraryModal = () => {
  isLibraryOpen.value = true;
};

const openEditModal = (task: RoutineTask) => {
  selectedTask.value = task;
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
    const { id, createdAt, updatedAt, order, ...taskData } = task;
    void routineStore.addTask({
      ...taskData,
      title: `${task.title} (Cópia)`,
    });
  });
};

const handleImportKit = async () => {
  importingKit.value = true;
  try {
    await routineStore.importInitialKit();
    $q.notify({
      type: 'positive',
      message: 'Kit inicial de canto importado com sucesso! 🚀',
      position: 'top',
      timeout: 2500
    });
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao importar o kit de canto inicial.'
    });
  } finally {
    importingKit.value = false;
  }
};

// --- ANIMAÇÕES (GSAP) ---
const setCardRef = (componentInstance: any, index: number) => {
  if (componentInstance) {
    cardsRefs.value[index] = componentInstance.$el || componentInstance;
  }
};

watch(() => props.tasks, (newTasks) => {
  if (newTasks.length > 0) {
    const validCardsRefs = cardsRefs.value.filter(el => el !== null && el !== undefined);
    const allElementsToAnimate = [...validCardsRefs];
    
    if (addCardWrapperRef.value) {
      allElementsToAnimate.push(addCardWrapperRef.value);
    }
    if (libraryCardWrapperRef.value) {
      allElementsToAnimate.push(libraryCardWrapperRef.value);
    }

    gsap.from(allElementsToAnimate, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.2)',
      clearProps: 'all'
    });
  }
}, { immediate: true });

const onTaskSaved = () => {
  console.log('Lição salva ou importada com sucesso!');
};
</script>

<style scoped>
.add-card-wrapper {
  display: flex;
  flex-direction: column;
}

.ghost-card {
  opacity: 0.4;
  filter: brightness(0.9);
  border: 2px dashed var(--q-primary);
  border-radius: 16px;
}

.empty-state-card {
  border-radius: 20px;
  border: 1px dashed rgba(var(--q-primary), 0.2);
}

.bg-glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.border-2 {
  border-width: 2px;
}

/* Animação suave para o ícone do estado vazio */
.float-animation {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}
</style>
