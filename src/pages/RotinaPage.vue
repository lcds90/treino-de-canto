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

    <RoutineActions @finish="onRoutineCompleted" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoutineStore } from 'src/stores/routine-store';

import RoutineHeader from 'src/components/RoutineHeader.vue';
import RoutineList from 'src/components/RoutineList.vue';
import RoutineActions from 'src/components/RoutineActions.vue';
import RoutineFilters from 'src/components/RoutineFilters.vue';

const routineStore = useRoutineStore();
const { activeFilters, filteredTasks: tasks, isLoading } = storeToRefs(routineStore);
const { fetchTasks, finishRoutineAction } = routineStore;

onMounted(async () => {
  // Dispara a busca inicial do Firebase (ou mock) ao carregar a tela
  await fetchTasks();
});

const onRoutineCompleted = async () => {
  // Ação disparada APÓS a animação de sucesso do botão terminar
  await finishRoutineAction();
  // Aqui você pode colocar um router.push('/') se desejar
};
</script>

<style scoped>
/* A regra de ouro do Sticky */
.sticky-wrapper {
  position: sticky;
  top: 16px; /* A distância do topo da tela */
  z-index: 100; /* Garante que os cards passem por baixo dele e não por cima */
}
</style>
