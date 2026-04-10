<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useWorkoutStore } from 'src/stores/workout-store';

const workoutStore = useWorkoutStore();
onMounted(async () => {
  await workoutStore.fetchSessions();
});
</script>
