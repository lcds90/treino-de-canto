<template>
  <q-page class="bg-grey-1 q-pa-md">
    <RoutineHeader />
    <div class="row justify-center sticky-wrapper q-mb-md">
      <div class="col-12 col-md-8 col-lg-6">
        <RoutineFilters v-model="activeFilters" />
      </div>
    </div>
    <RoutineList v-if="!isLoading" :tasks="tasks" />

    <div style="height: 100px; width: 100%"></div>

    <RoutineActions @finish="saveWorkoutSessionAction" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoutineStore } from 'src/stores/routine-store';
import { useQuasar } from 'quasar';
import RoutineHeader from 'src/components/RoutineHeader.vue';
import RoutineList from 'src/components/RoutineList.vue';
import RoutineActions from 'src/components/RoutineActions.vue';
import RoutineFilters from 'src/components/RoutineFilters.vue';
import { useWorkoutStore } from 'src/stores/workout-store';

const routineStore = useRoutineStore();
const workoutStore = useWorkoutStore();
const $q = useQuasar();
const { activeFilters, filteredTasks: tasks, isLoading } = storeToRefs(routineStore);
const { fetchTasks } = routineStore;
const { saveWorkoutSessionAction } = workoutStore;

onMounted(async () => {
  await fetchTasks();
  if (workoutStore.hasTrainedToday) {
    $q.notify({
      message: 'Hoje um treino já foi registrado! 💪',
      color: 'info',
      icon: 'info',
      position: 'top',
      timeout: 0,
      closeBtn: 'Fechar',
      caption: 'Mas sinta-se livre para treinar mais! 🎶',
    });
  }
});
</script>

<style scoped>
/* A regra de ouro do Sticky */
.sticky-wrapper {
  position: sticky;
  top: 16px; /* A distância do topo da tela */
  z-index: 100; /* Garante que os cards passem por baixo dele e não por cima */
}
</style>
