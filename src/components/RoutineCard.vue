<template>
  <q-card class="routine-card shadow-4 text-left">
    <q-card-section class="bg-secondary text-white">
      <div class="text-h6 text-weight-bold">{{ task.title }}</div>
    </q-card-section>

    <q-video :src="task.videoUrl" :ratio="16 / 9" />

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
          <q-item-section avatar>
            <animated-checkbox v-model="item.done" :label="item.label" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import AnimatedCheckbox from './AnimatedCheckbox.vue';
import { RoutineTask } from './models';

// O componente recebe a "task" inteira como propriedade
defineProps<{
  task: RoutineTask;
}>();
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
  transition: background-color 0.3s ease;
  border: 1px solid transparent;
}

.checklist-item:hover {
  background-color: #f5f5f5;
  border-color: #e0e0e0;
}
</style>
