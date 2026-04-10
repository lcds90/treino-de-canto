<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card ref="dialogCardRef" style="min-width: 450px; border-radius: 16px">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6 text-weight-bold">{{ dialogLabel.title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="handleCancel" />
      </q-card-section>

      <q-card-section class="q-pt-md scroll" style="max-height: 70vh">
        <q-form ref="formRef" class="q-gutter-y-md">
          <q-input
            v-model="formData.title"
            label="Título da Aula/Treino *"
            outlined
            color="primary"
            dense
            :rules="[(val) => !!val || 'O título é obrigatório']"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-10">
              <q-input
                v-model="formData.title"
                label="Título da Aula/Treino *"
                outlined
                dense
                color="primary"
                :rules="[(val) => !!val || 'Obrigatorio']"
              />
            </div>
            <div class="col-2">
              <q-input
                v-model.number="formData.order"
                type="number"
                label="Ordem"
                outlined
                dense
                color="primary"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <q-select
              v-model="formData.platform"
              :options="platformOptions"
              label="Plataforma *"
              outlined
              dense
              emit-value
              map-options
              class="col-4"
            />
            <q-input
              v-model="formData.mediaUrl"
              label="Link do Vídeo/Curso *"
              outlined
              dense
              placeholder="https://..."
              class="col-8"
              :rules="[(val) => !!val || 'O link é obrigatório']"
            />
          </div>

          <q-input
            v-model="formData.instructions"
            type="textarea"
            label="Instruções"
            outlined
            dense
            autogrow
          />

          <div class="column q-gutter-y-sm q-mt-sm">
            <div class="text-subtitle2 row items-center">
              <q-icon name="checklist" class="q-mr-xs" />
              Itens da Checklist
            </div>

            <div class="row q-gutter-x-sm">
              <q-input
                v-model="newItemLabel"
                placeholder="Ex: Escala em Dó Maior"
                outlined
                dense
                class="col"
                @keyup.enter="addChecklistItem"
              />
              <q-btn
                color="secondary"
                icon="add"
                @click="addChecklistItem"
                :disable="!newItemLabel.trim()"
              />
            </div>

            <q-list dense bordered separator class="rounded-borders">
              <q-item
                v-for="(item, index) in formData.checklist"
                :key="index"
                class="q-py-sm checklist-item-row"
              >
                <q-item-section avatar>
                  <q-icon name="check_circle" color="grey-4" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="removeChecklistItem(index)"
                  />
                </q-item-section>
              </q-item>

              <q-item v-if="formData.checklist.length === 0" class="text-italic">
                Nenhum item adicionado...
              </q-item>
            </q-list>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary q-pb-md q-pr-md q-pt-none">
        <q-btn flat label="Cancelar" color="grey-7" @click="handleCancel" />
        <q-btn-dropdown
          v-if="!isEditMode"
          split
          class="glossy"
          color="positive"
          :label="dialogLabel.confirm"
          @click="() => handleSave()"
        >
          <q-list>
            <q-item clickable @click="() => handleSave(true)">
              <q-item-section avatar>
                <q-avatar icon="save" color="positive" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Salvar e adicionar outro</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn
          v-else
          ref="saveBtnRef"
          unelevated
          color="positive"
          :label="dialogLabel.confirm"
          class="text-weight-bold shadow-3"
          @click="() => handleSave()"
          :loading="isSaving"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import gsap from 'gsap';
import type { RoutineTask, ChecklistItem } from 'src/components/models';
import { useRoutineStore } from 'src/stores/routine-store';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  taskToEdit: { type: Object as () => RoutineTask | null, default: null }, // Nova Prop
});

const emit = defineEmits(['update:modelValue', 'saved']);
const routineStore = useRoutineStore();

// --- ESTADO ---
const isEditMode = computed(() => !!props.taskToEdit);
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
const dialogLabel = computed(() => ({
  title: isEditMode.value ? 'Editar rotina ✨' : 'Nova rotina ✨',
  confirm: isEditMode.value ? 'Salvar alterações 📝' : 'Adicionar 🚀',
}));

const initialForm = (): Omit<RoutineTask, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  platform: 'youtube',
  mediaUrl: '',
  instructions: '',
  checklist: [],
});

const formData = reactive(initialForm());
const newItemLabel = ref('');

// --- WATCHER PARA CARREGAR DADOS NA EDIÇÃO ---
watch(
  () => props.taskToEdit,
  (task) => {
    if (task) {
      Object.assign(formData, JSON.parse(JSON.stringify(task))); // Clone profundo simples
    } else {
      Object.assign(formData, initialForm());
    }
  },
  { immediate: true },
);

// --- MÉTODOS ---
const handleSave = async (preventClose?: boolean) => {
  const isValid = await formRef.value.validate();
  if (!isValid) return;

  isSaving.value = true;
  try {
    if (isEditMode.value && props.taskToEdit) {
      // Chama a ação de UPDATE na store
      await routineStore.updateTask({ ...formData, id: props.taskToEdit.id } as RoutineTask);
    } else {
      await routineStore.addTask({
        ...formData,
      } as Omit<RoutineTask, 'id'>);
    }
    if (preventClose) {
      resetForm();
      return;
    }

    // Animação de sucesso (mesma de antes)
    gsap.to(dialogCardRef.value.$el, {
      scale: 0.5,
      opacity: 0,
      duration: 0.4,
      ease: 'back.in(1.7)',
      onComplete: () => {
        isOpen.value = false;
        emit('saved');
      },
    });
  } catch (e) {
    console.error(e);
  } finally {
    isSaving.value = false;
  }
};

const dialogCardRef = ref<any | null>(null);
const saveBtnRef = ref<any | null>(null);
const formRef = ref<any | null>(null);
const isSaving = ref(false);

const platformOptions = [
  { label: 'YouTube 🔴', value: 'youtube' },
  { label: 'Hotmart 🔥', value: 'hotmart' },
  { label: 'Udemy 🎓', value: 'udemy' },
  { label: 'Yousician 🎹', value: 'yousician' },
  { label: 'Outro 🔗', value: 'other' },
];

const addChecklistItem = () => {
  if (!newItemLabel.value.trim()) return;

  const newItem: ChecklistItem = {
    id: Date.now().toString(),
    label: newItemLabel.value.trim(),
    done: false,
  };

  formData.checklist.push(newItem);
  newItemLabel.value = '';

  // Animaçãozinha marota de entrada do novo item
  setTimeout(() => {
    const items = document.querySelectorAll('.checklist-item-row');
    const lastItem = items[items.length - 1];
    if (lastItem) {
      gsap.from(lastItem, { x: -20, opacity: 0, duration: 0.3, ease: 'back.out' });
    }
  }, 0);
};

const removeChecklistItem = (index: number) => {
  formData.checklist.splice(index, 1);
};

const resetForm = () => {
  Object.assign(formData, initialForm());
  newItemLabel.value = '';
};

const handleCancel = () => {
  if (dialogCardRef.value) {
    gsap.to(dialogCardRef.value.$el, {
      scale: 0.8,
      opacity: 0,
      y: 100,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        isOpen.value = false;
        resetForm();
      },
    });
  } else {
    isOpen.value = false;
  }
};
</script>
