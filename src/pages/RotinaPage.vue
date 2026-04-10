<template>
  <q-page class="q-pa-md">
    <div v-if="isReadOnly" class="q-mb-md">
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Voltar"
        @click="goBack"
        class="text-weight-bold"
      />
    </div>

    <div class="text-center q-mb-xl q-mt-sm">
      <h1 class="text-h4 text-weight-bold text-primary q-mb-sm">
        {{ isReadOnly ? '📋 Resumo do Treino' : workoutTitle }}
      </h1>
      <p
        :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'"
        class="text-subtitle1"
        v-if="!isReadOnly"
      >
        {{ workoutSubtitle }}
      </p>
      <p :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'" class="text-subtitle1" v-else>
        Visualizando o registro de um treino finalizado.
      </p>
    </div>

    <q-banner
      inline-actions
      rounded
      class="banner-width"
      v-if="!isReadOnly && workoutStore.hasTrainedToday"
    >
      <p class="text-body2 q-mb-none">{{ bannerTitle }}</p>
      <p class="text-caption q-mb-none">{{ bannerSubtitle }}</p>
      <template v-slot:action>
        <q-btn flat label="Ver treinos" @click="isOpen = true" />
      </template>
    </q-banner>

    <q-dialog v-model="isOpen" position="standard" full-width full-height>
      <workout-history />
    </q-dialog>

    <div v-if="!isReadOnly" class="row justify-center sticky-wrapper q-my-md">
      <div class="col-12 col-md-8 col-lg-6">
        <RoutineFilters v-model="activeFilters" />
      </div>
    </div>

    <RoutineList v-if="!isLoading" :tasks="currentTasks" :readOnly="isReadOnly" />

    <div style="height: 100px; width: 100%"></div>

    <RoutineActions v-if="!isReadOnly" @finish="handleFinish" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router'; // Importamos o Roteador
import { useRoutineStore } from 'src/stores/routine-store';
import { useWorkoutStore } from 'src/stores/workout-store';
import { useQuasar } from 'quasar';
import type { RoutineTask } from 'src/components/models';

import RoutineHeader from 'src/components/RoutineHeader.vue';
import RoutineList from 'src/components/RoutineList.vue';
import RoutineActions from 'src/components/RoutineActions.vue';
import RoutineFilters from 'src/components/RoutineFilters.vue';
import WorkoutHistory from 'src/components/WorkoutHistory.vue';
import { useSettingsStore } from 'src/stores/settings-store';

const route = useRoute();
const router = useRouter();
const routineStore = useRoutineStore();
const workoutStore = useWorkoutStore();
const settingsStore = useSettingsStore();
const $q = useQuasar();

const { activeFilters, filteredTasks, isLoading } = storeToRefs(routineStore);
const { workoutTitle, workoutSubtitle, bannerTitle, bannerSubtitle } = storeToRefs(settingsStore);
const { fetchTasks } = routineStore;
const { saveWorkoutSessionAction } = workoutStore;

const isOpen = ref(false);
const snapshotTasks = ref<RoutineTask[]>([]); // Tarefas congeladas do treino

// 🧠 A Mágica do Modo Leitura
const workoutId = computed(() => route.params.id as string | undefined);
const isReadOnly = computed(() => !!workoutId.value);

// Determina qual lista de tarefas mostrar na tela
const currentTasks = computed(() => {
  return isReadOnly.value ? snapshotTasks.value : filteredTasks.value;
});

const onFetchData = async () => {
  if (isReadOnly.value) {
    const session = workoutStore.sessions.find((s) => s.id === workoutId.value);
    if (session) {
      snapshotTasks.value = session.tasksSnapshot;
    } else {
      $q.notify({ type: 'negative', message: 'Treino não encontrado.' });
      router.push('/');
    }
    return;
  }

  await fetchTasks();
};

watch(
  () => route.params.id,
  async () => {
    await onFetchData();
  },
  { immediate: true },
);

const goBack = () => {
  // router.back() garante que o usuário volta exatamente para a aba anterior
  // seja a Home, seja a página de histórico de treinos.
  router.back();
};

const handleFinish = async (workoutData: any) => {
  await saveWorkoutSessionAction(workoutData);
  router.push('/');
};
</script>

<style scoped>
.sticky-wrapper {
  position: sticky;
  top: 16px;
  z-index: 100;
}

.banner-width {
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--q-info, #e0f7fa);
}
</style>
