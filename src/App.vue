<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useWorkoutStore } from 'src/stores/workout-store';
import { useSettingsStore } from './stores/settings-store';
import { useAuthStore } from './stores/auth-store';

const authStore = useAuthStore();
const workoutStore = useWorkoutStore();
const settingsStore = useSettingsStore();

watch(
  () => authStore.isAuthenticated,
  async (isAuth) => {
    if (isAuth) {
      await workoutStore.fetchSessions();
      await settingsStore.initSettings();
    } else {
      workoutStore.sessions = [];
      // Apply default colors if user logs out
      settingsStore.themeColors = { ...DEFAULT_COLORS };
    }
  },
  { immediate: true },
);

import { DEFAULT_COLORS } from './stores/settings-store';
</script>
