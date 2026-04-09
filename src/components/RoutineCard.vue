<template>
  <q-card class="routine-card shadow-4 text-left">

    <q-card-section class="bg-secondary text-white">
      <div class="text-h6 text-weight-bold">{{ task.title }}</div>
    </q-card-section>

    <q-video
      v-if="task.platform === 'youtube'"
      :src="task.mediaUrl"
      :ratio="16/9"
    />

    <q-card-section
      v-else
      class="bg-grey-2 text-center q-py-xl flex flex-center column"
      style="min-height: 200px;"
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
      <div class="text-subtitle2 text-primary q-mb-sm">
        📝 Instruções:
      </div>
      <p class="text-body1 text-grey-8">
        {{ task.instructions }}
      </p>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="text-subtitle2 text-primary q-mb-md">
        ✅ Checklist de Hoje:
      </div>

      <q-list dense>
        <q-item
          v-for="item in task.checklist"
          :key="item.id"
          tag="label"
          v-ripple
          class="checklist-item q-mb-sm rounded-borders"
          :class="{ 'bg-green-1': item.done }"
        >
          <q-item-section avatar>
            <AnimatedCheckbox v-model="item.done" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              class="text-body1"
              :class="{ 'text-strike text-grey-5': item.done }"
            >
              {{ item.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
import AnimatedCheckbox from './AnimatedCheckbox.vue'
import { RoutineTask, PlatformType } from './models';

defineProps<{
  task: RoutineTask
}>()

// --- FUNÇÕES AUXILIARES PARA ESTILIZAR OS CURSOS EXTERNOS ---

const getPlatformIcon = (platform: PlatformType) => {
  if (platform === 'udemy') return 'school';
  if (platform === 'hotmart') return 'local_fire_department';
  if (platform === 'yousician') return 'piano'
  return 'link';
}

const getPlatformColor = (platform: PlatformType) => {
  if (platform === 'udemy') return 'deep-purple-6';
  if (platform === 'hotmart') return 'deep-orange-8';
  if (platform === 'yousician') return 'green-6';
  return 'primary';
}

const getPlatformName = (platform: PlatformType) => {
  if (platform === 'udemy') return 'Udemy';
  if (platform === 'hotmart') return 'Hotmart';
  if (platform === 'yousician') return 'Yousician App';
  return 'Plataforma Externa';
}
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
</style>
