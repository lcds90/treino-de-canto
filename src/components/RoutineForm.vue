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
          <!-- 1. Tipo de Exercício (Platform) - Escolhe Primeiro! -->
          <q-select
            v-model="formData.platform"
            :options="platformOptions"
            label="Tipo de Exercício *"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="onPlatformChange"
          />

          <!-- 2. Título do Exercício -->
          <q-input
            v-model="formData.title"
            label="Título do Exercício *"
            outlined
            dense
            color="primary"
            :rules="[(val) => !!val || 'O título é obrigatório']"
          />

          <!-- 2.5 Ordem do Exercício -->
          <q-input
            v-model.number="formData.order"
            type="number"
            label="Ordem"
            outlined
            dense
            color="primary"
          />

          <!-- Configurações Musicais (BPM, Duração das Notas, Silêncios) -->
          <div v-if="isVocalExercise" class="q-gutter-y-sm q-pt-xs">
            <q-input
              v-model.number="formData.bpm"
              type="number"
              label="BPM (Tempo) *"
              outlined
              dense
              color="primary"
              :rules="[
                (val) => !!val || 'BPM é obrigatório',
                (val) => (val >= 40 && val <= 240) || 'BPM entre 40 e 240'
              ]"
            />
            <q-select
              v-model="formData.noteDuration"
              :options="noteDurationOptions"
              label="Duração das Notas *"
              outlined
              dense
              emit-value
              map-options
            />
            <div class="q-mt-sm">
              <q-checkbox
                v-model="formData.includeRests"
                label="Incluir Figuras de Silêncio (Pausas) 𝄾"
                dense
                color="primary"
              />
            </div>
          </div>

          <!-- 3. Link (mediaUrl) - Ocultado para Exercícios Vocais Locais -->
          <q-input
            v-if="!isVocalExercise"
            v-model="formData.mediaUrl"
            label="Link do Vídeo/Curso *"
            outlined
            dense
            placeholder="https://..."
            :rules="[(val) => !!val || 'O link é obrigatório']"
          />

          <!-- Seção de Marcações de Tempo (Apenas para YouTube) -->
          <section v-if="formData.platform === 'youtube'">
            <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">
              Seções do Vídeo (Timestamps) ⏱️
            </div>
            <div class="text-caption text-grey-7 q-mb-md">
              Adicione marcações para saltar rapidamente para partes do vídeo durante o treino.
            </div>

            <!-- Lista de Timestamps Existentes -->
            <q-list v-if="formData.timestamps && formData.timestamps.length" bordered separator class="rounded-borders q-mb-md">
              <q-item v-for="ts in formData.timestamps" :key="ts.id" class="q-py-xs">
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ ts.label }}</q-item-label>
                  <q-item-label caption class="text-secondary">{{ formatSeconds(ts.time) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round dense color="negative" icon="delete" size="sm" @click="removeTimestamp(ts.id)" />
                </q-item-section>
              </q-item>
            </q-list>

            <!-- Adicionar Novo Timestamp -->
            <div class="row q-col-gutter-sm items-start">
              <div class="col-5">
                <q-input
                  v-model="newTimestampLabel"
                  label="Rótulo (ex: Aquecimento)"
                  outlined
                  dense
                  hide-bottom-space
                  color="primary"
                />
              </div>
              <div class="col-5">
                <q-input
                  v-model="newTimestampTime"
                  label="Tempo (MM:SS ou s)"
                  placeholder="01:30 ou 90"
                  outlined
                  dense
                  hide-bottom-space
                  color="primary"
                  :rules="[validateTimeRule]"
                />
              </div>
              <div class="col-2 text-right">
                <q-btn
                  color="primary"
                  icon="add"
                  unelevated
                  dense
                  style="height: 40px; width: 100%;"
                  @click="addTimestamp"
                >
                  <q-tooltip>Adicionar seção</q-tooltip>
                </q-btn>
              </div>
            </div>
          </section>

          <!-- 4. Instruções - Ocultado se for Vocalize/Melisma -->
          <q-input
            v-if="!isVocalExercise"
            v-model="formData.instructions"
            type="textarea"
            label="Instruções"
            outlined
            dense
            autogrow
          />
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
import type { RoutineTask, ChecklistItem, VideoTimestamp } from 'src/components/models';
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
  title: 'Exercício de Vocalize',
  platform: 'vocalize',
  mediaUrl: '',
  instructions: 'Siga o guia de notas subindo e descendo o tom para aquecer sua voz.',
  bpm: 120,
  noteDuration: 'quarter',
  includeRests: false,
  timestamps: [],
});

const formData = reactive(initialForm());
const isVocalExercise = computed(() => formData.platform === 'vocalize' || formData.platform === 'melisma');

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
      await routineStore.updateTask({ ...formData, id: props.taskToEdit.id });
    } else {
      await routineStore.addTask({
        ...formData,
      });
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

// --- ESTADOS E AUXILIARES DO TIMESTAMP ---
const newTimestampLabel = ref('');
const newTimestampTime = ref('');

const validateTimeRule = (val: string) => {
  if (!val) return true;
  const isMmSs = /^(\d+):([0-5]\d)$/.test(val);
  const isSeconds = /^\d+$/.test(val);
  return isMmSs || isSeconds || 'Formatos aceitos: MM:SS ou segundos';
};

const parseTimeToSeconds = (val: string): number => {
  if (val.includes(':')) {
    const parts = val.split(':');
    const minutes = parseInt(parts[0] || '0', 10);
    const seconds = parseInt(parts[1] || '0', 10);
    return minutes * 60 + seconds;
  }
  return parseInt(val, 10);
};

const formatSeconds = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const addTimestamp = () => {
  const label = newTimestampLabel.value.trim();
  const timeVal = newTimestampTime.value.trim();
  if (!label || !timeVal) return;

  const valid = validateTimeRule(timeVal);
  if (valid !== true) return;

  const seconds = parseTimeToSeconds(timeVal);

  if (!formData.timestamps) {
    formData.timestamps = [];
  }

  formData.timestamps.push({
    id: Math.random().toString(36).substring(2, 9),
    label,
    time: seconds,
  });

  newTimestampLabel.value = '';
  newTimestampTime.value = '';
};

const removeTimestamp = (id: string) => {
  if (formData.timestamps) {
    formData.timestamps = formData.timestamps.filter((ts) => ts.id !== id);
  }
};

const platformOptions = [
  { label: 'Vocalize (Nativo) 🎵', value: 'vocalize' },
  { label: 'Melisma (Nativo) 🌊', value: 'melisma' },
  { label: 'YouTube 🔴', value: 'youtube' },
  { label: 'Hotmart 🔥', value: 'hotmart' },
  { label: 'Udemy 🎓', value: 'udemy' },
  { label: 'Yousician 🎹', value: 'yousician' },
  { label: 'Outro 🔗', value: 'other' },
];

const noteDurationOptions = [
  { label: 'Mínima (2 tempos) 𝅗𝅥', value: 'half' },
  { label: 'Semínima (1 tempo) 𝅘𝅥', value: 'quarter' },
  { label: 'Colcheia (0.5 tempo) 𝅘𝅥𝅮', value: 'eighth' },
  { label: 'Semicolcheia (0.25 tempo) 𝅘𝅥𝅯', value: 'sixteenth' },
  { label: 'Alternada (Mista) 𝅘𝅥𝅘𝅥𝅮', value: 'mixed' },
];

const onPlatformChange = (val: string) => {
  if (val === 'vocalize') {
    formData.title = 'Exercício de Vocalize';
    formData.instructions = 'Siga o guia de notas subindo e descendo o tom para aquecer sua voz.';
    formData.bpm = 120;
    formData.noteDuration = 'quarter';
    formData.includeRests = false;
  } else if (val === 'melisma') {
    formData.title = 'Exercício de Melisma';
    formData.instructions = 'Siga o padrão melódico de melisma para treinar agilidade e precisão vocal.';
    formData.bpm = 100;
    formData.noteDuration = 'quarter';
    formData.includeRests = false;
  } else {
    if (formData.title === 'Exercício de Vocalize' || formData.title === 'Exercício de Melisma') {
      formData.title = '';
    }
    if (formData.instructions === 'Siga o guia de notas subindo e descendo o tom para aquecer sua voz.' ||
        formData.instructions === 'Siga o padrão melódico de melisma para treinar agilidade e precisão vocal.') {
      formData.instructions = '';
    }
    delete formData.bpm;
    delete formData.noteDuration;
    delete formData.includeRests;
  }
  if (val !== 'youtube') {
    delete formData.timestamps;
  }
};

const resetForm = () => {
  Object.assign(formData, initialForm());
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
