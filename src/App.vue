<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useWorkoutStore } from 'src/stores/workout-store';
import { useSettingsStore } from './stores/settings-store';

const workoutStore = useWorkoutStore();
const settingsStore = useSettingsStore();

onMounted(async () => {
  await workoutStore.fetchSessions();
  await settingsStore.initSettings();
});
</script>
