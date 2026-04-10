<template>
  <q-card class="routine-card shadow-4 text-left" bordered>
    <q-card-section class="bg-accent text-white row items-center justify-between">
      <div class="row items-center">
        <q-btn
          v-if="!readOnly"
          ref="orderBtnRef"
          flat
          round
          dense
          icon="drag_indicator"
          color="white"
          class="action-btn drag-handle"
          @click="handleDuplicate"
        >
          <q-tooltip>Ordenar Rotina</q-tooltip>
        </q-btn>

        <div class="text-h6 text-weight-bold">
          {{ task.title }}
          <q-badge
            color="white"
            text-color="secondary"
            class="q-ml-sm text-weight-bold"
            align="middle"
          >
            {{ task.order || 1 }} / {{ totalTasks }}
          </q-badge>
        </div>
      </div>

      <div class="row justify-between q-gutter-x-sm">
        <q-btn
          ref="copyBtnRef"
          flat
          round
          dense
          :icon="readOnly ? 'add' : 'content_copy'"
          color="white"
          class="action-btn"
          @click="handleDuplicate"
        >
          <q-tooltip>
            {{ readOnly ? 'Adicionar esta rotina à meu treino atual' : 'Duplicar rotina' }}
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="!readOnly"
          ref="editBtnRef"
          flat
          round
          dense
          icon="edit"
          color="white"
          class="action-btn"
          @click="handleEdit"
        >
          <q-tooltip>Editar Rotina</q-tooltip>
        </q-btn>

        <q-btn
          v-if="!readOnly"
          ref="deleteBtnRef"
          flat
          round
          dense
          icon="delete"
          color="white"
          class="action-btn"
          @click="handleDelete"
        >
          <q-tooltip>Excluir Rotina</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>

    <q-video v-if="task.platform === 'youtube'" :src="getEmbedUrl(task.mediaUrl)" :ratio="16 / 9" />

    <q-card-section
      v-else
      class="text-center q-py-xl flex flex-center column"
      style="min-height: 200px"
    >
      <q-icon
        :name="getPlatformIcon(task.platform)"
        size="4rem"
        :color="getPlatformColor(task.platform)"
        class="q-mb-sm"
      />
      <div class="text-subtitle1 text-weight-medium q-mb-md">
        Esta aula está hospedada na <strong>{{ getPlatformName(task.platform) }}</strong>
      </div>
      <q-btn
        :href="task.mediaUrl"
        target="_blank"
        :color="getPlatformColor(task.platform)"
        icon-right="open_in_new"
        label="Acessar Aula"
        rounded
        unelevated
        class="shadow-2"
      />
    </q-card-section>

    <q-card-section>
      <div class="text-subtitle2 text-primary q-mb-sm">📝 Instruções:</div>
      <p class="text-body1">
        {{ task.instructions }}
      </p>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="text-subtitle2 text-primary q-mb-md">✅ Checklist de Hoje:</div>

      <q-list dense>
        <q-item
          v-for="item in task.checklist"
          :key="item.id"
          tag="label"
          v-ripple="!readOnly"
          class="checklist-item q-mb-sm rounded-borders"
          :class="{ 'pointer-events-none': readOnly }"
        >
          <q-item-section class="row items-start">
            <AnimatedCheckbox
              v-model="item.done"
              :label="item.label"
              @update:model-value="syncChecklistToDatabase"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator v-if="task.createdAt || task.updatedAt" />
    <q-card-section
      v-if="task.createdAt || task.updatedAt"
      class="q-py-sm row justify-between text-caption"
    >
      <div v-if="task.createdAt" class="row items-center">
        <q-icon name="event" class="q-mr-xs" size="xs" />
        Criado em: {{ formatDate(task.createdAt) }}
      </div>
      <div v-if="task.updatedAt" class="row items-center text-right">
        <q-icon name="update" class="q-mr-xs" size="xs" />
        Atualizado: {{ formatDate(task.updatedAt) }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import AnimatedCheckbox from './AnimatedCheckbox.vue';
import type { RoutineTask, PlatformType } from './models';
import { useRoutineStore } from 'src/stores/routine-store';

const props = defineProps<{
  task: RoutineTask;
  totalTasks: number;
  readOnly: boolean;
}>();

const emit = defineEmits(['edit', 'delete', 'duplicate']);
const routineStore = useRoutineStore();

// --- REFERÊNCIAS DOS BOTÕES ---
const copyBtnRef = ref<any | null>(null);
const editBtnRef = ref<any | null>(null);
const deleteBtnRef = ref<any | null>(null);

// --- FUNÇÃO DE ANIMAÇÃO GENÉRICA (Glitter + Shake) ---
const animateAction = (btnRef: any, glitterColor: string, onCompleteCallback: () => void) => {
  if (!btnRef || !btnRef.$el) {
    onCompleteCallback();
    return;
  }

  const btnElement = btnRef.$el;
  const tl = gsap.timeline({ onComplete: onCompleteCallback });

  // 1. Chacoalho (Shake) rápido do botão
  tl.fromTo(
    btnElement,
    { rotation: -15 },
    { rotation: 15, duration: 0.05, yoyo: true, repeat: 3, ease: 'power1.inOut' },
  ).to(btnElement, { rotation: 0, duration: 0.05 });

  // 2. Geração dos Glitters
  const rect = btnElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const glitter = document.createElement('div');
    glitter.classList.add('action-glitter');
    glitter.style.backgroundColor = glitterColor;

    glitter.style.left = `${centerX}px`;
    glitter.style.top = `${centerY}px`;
    document.body.appendChild(glitter);

    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 40;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    gsap.to(glitter, {
      x: destX,
      y: destY,
      scale: Math.random() * 1.5 + 0.5,
      opacity: 0,
      rotation: Math.random() * 360,
      duration: 0.6 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => {
        glitter.remove();
      },
    });
  }
};

// --- HANDLERS DOS BOTÕES ---

const handleDuplicate = () => {
  animateAction(copyBtnRef.value, '#00E5FF', () => {
    emit('duplicate', props.task);
  });
};

const handleEdit = () => {
  animateAction(editBtnRef.value, '#FFD700', () => {
    emit('edit', props.task);
  });
};

const handleDelete = () => {
  animateAction(deleteBtnRef.value, '#FF1744', () => {
    emit('delete', props.task);
  });
};

// --- SINCRONIZAÇÃO DO CHECKLIST ---
const syncChecklistToDatabase = async () => {
  try {
    await routineStore.updateTask(props.task);
  } catch (error) {
    console.error('Erro ao sincronizar o checklist:', error);
  }
};

// --- HELPERS DE PLATAFORMA ---
const getPlatformIcon = (platform: PlatformType) => {
  if (platform === 'udemy') return 'school';
  if (platform === 'hotmart') return 'local_fire_department';
  if (platform === 'yousician') return 'piano';
  return 'link';
};

const getPlatformColor = (platform: PlatformType) => {
  if (platform === 'udemy') return 'deep-purple-6';
  if (platform === 'hotmart') return 'deep-orange-8';
  if (platform === 'yousician') return 'green-6';
  return 'primary';
};

const getPlatformName = (platform: PlatformType) => {
  if (platform === 'udemy') return 'Udemy';
  if (platform === 'hotmart') return 'Hotmart';
  if (platform === 'yousician') return 'Yousician App';
  return 'Plataforma Externa';
};

// --- FORMATADOR DE URL DO YOUTUBE ---
const getEmbedUrl = (url?: string) => {
  if (!url) return '';

  // Se já for um link de embed, retorna direto
  if (url.includes('/embed/')) return url;

  // Se for link copiado pelo celular (youtu.be/ID)
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Se for link padrão do navegador (youtube.com/watch?v=ID)
  if (url.includes('watch?v=')) {
    const videoId = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
};

// --- FORMATAÇÃO DE DATA ---
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
</script>

<style scoped>
.routine-card {
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.routine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.checklist-item {
  transition: filter 0.3s ease;
  border: 1px solid transparent;
  overflow: visible !important;
}

.checklist-item:hover {
  filter: brightness(0.98);
  border-color: #e0e0e0;
}

.action-btn:hover {
  opacity: 0.9;
}

/* Cursores para a área de arrastar */
.drag-handle {
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
</style>

<style>
.action-glitter {
  position: fixed;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}

.pointer-events-none {
  pointer-events: none;
  opacity: 0.8;
}
</style>
