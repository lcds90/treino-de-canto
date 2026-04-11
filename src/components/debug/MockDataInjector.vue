<template>
  <div class="q-pa-md border-dashed">
    <div class="text-subtitle2 q-mb-sm text-grey-7">Debug: Injeção de Dados</div>
    <q-btn
      color="accent"
      icon="cloud_upload"
      label="Injetar Mocks no Firebase"
      :loading="loading"
      @click="handleInjection"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { SINGING_ROUTINE_MOCKS } from 'src/mocks/RoutineMock';
import { useRoutineStore } from 'src/stores/routine-store';

const $q = useQuasar();
const loading = ref(false);
const routineStore = useRoutineStore();
const handleInjection = async () => {
  loading.value = true;

  try {
    // Processamento em lote (Sequential addDoc)
    for (const mock of SINGING_ROUTINE_MOCKS) {
      await routineStore.addTask(mock);
    }

    $q.notify({
      type: 'positive',
      message: `${SINGING_ROUTINE_MOCKS.length} rotinas injetadas com sucesso!`,
      position: 'top'
    });
  } catch (error) {
    console.error('Erro na injeção de mocks:', error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao injetar dados no Firebase.'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #ccc;
  border-radius: 8px;
}
</style>
