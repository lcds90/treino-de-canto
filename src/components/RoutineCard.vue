<template>
  <q-card class="routine-card shadow-4 text-left">
    <q-card-section class="bg-secondary text-white row items-center justify-between">
      <div class="text-h6 text-weight-bold">{{ task.title }}</div>

      <div class="row justify-between q-gutter-x-sm">

        <q-btn
          ref="copyBtnRef"
          flat
          round
          dense
          icon="content_copy"
          color="white"
          class="action-btn"
          @click="handleDuplicate"
        >
          <q-tooltip>Duplicar Rotina</q-tooltip>
        </q-btn>

        <q-btn
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

    <q-video v-if="task.platform === 'youtube'" :src="task.mediaUrl" :ratio="16 / 9" />

    <q-card-section
      v-else
      class="bg-grey-2 text-center q-py-xl flex flex-center column"
      style="min-height: 200px"
    >
      <q-icon
        :name="getPlatformIcon(task.platform)"
        size="4rem"
        :color="getPlatformColor(task.platform)"
        class="q-mb-sm"
      />
      <div class="text-subtitle1 text-weight-medium text-grey-8 q-mb-md">
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
      <p class="text-body1 text-grey-8">
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
          v-ripple
          class="checklist-item q-mb-sm rounded-borders"
          :class="{ 'bg-green-1': item.done }"
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
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import AnimatedCheckbox from './AnimatedCheckbox.vue';
import { RoutineTask, PlatformType } from './models';
import { useRoutineStore } from 'src/stores/routine-store';

const props = defineProps<{
  task: RoutineTask;
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
  tl.fromTo(btnElement,
    { rotation: -15 },
    { rotation: 15, duration: 0.05, yoyo: true, repeat: 3, ease: 'power1.inOut' }
  ).to(btnElement, { rotation: 0, duration: 0.05 });

  // 2. Geração dos Glitters
  // Pegamos a posição do botão na tela para criar as partículas no lugar certo
  const rect = btnElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Criamos os elementos de glitter dinamicamente no body
  for (let i = 0; i < 8; i++) {
    const glitter = document.createElement('div');
    glitter.classList.add('action-glitter');
    glitter.style.backgroundColor = glitterColor;

    // Posiciona no centro do botão
    glitter.style.left = `${centerX}px`;
    glitter.style.top = `${centerY}px`;
    document.body.appendChild(glitter);

    // Calcula uma explosão radial aleatória
    const angle = (Math.random() * Math.PI * 2);
    const distance = 30 + Math.random() * 40;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    // Anima o glitter usando GSAP solto (não na timeline principal para não travar o callback)
    gsap.to(glitter, {
      x: destX,
      y: destY,
      scale: Math.random() * 1.5 + 0.5,
      opacity: 0,
      rotation: Math.random() * 360,
      duration: 0.6 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => {
        glitter.remove(); // Limpa o DOM quando a animação acabar
      }
    });
  }
};

// --- HANDLERS DOS BOTÕES ---

const handleDuplicate = () => {
  // Azul clarinho/Ciano para duplicar
  animateAction(copyBtnRef.value, '#00E5FF', () => {
    emit('duplicate', props.task);
  });
};

const handleEdit = () => {
  // Amarelo/Dourado para editar
  animateAction(editBtnRef.value, '#FFD700', () => {
    emit('edit', props.task);
  });
};

const handleDelete = () => {
  // Vermelho para deletar
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
</script>

<style scoped>
.routine-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.routine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.checklist-item {
  transition: background-color 0.3s ease;
  border: 1px solid transparent;
  overflow: visible !important;
}

.checklist-item:hover {
  background-color: #f5f5f5;
  border-color: #e0e0e0;
}

/* Garante que os botões não fiquem transparentes demais no hover padrão do Quasar */
.action-btn:hover {
  opacity: 0.9;
}
</style>

<style>
.action-glitter {
  position: fixed; /* Fixed para não se importar com o scroll local */
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none; /* Para não atrapalhar cliques */
  z-index: 9999;
  box-shadow: 0 0 4px rgba(255,255,255,0.8);
}
</style>
