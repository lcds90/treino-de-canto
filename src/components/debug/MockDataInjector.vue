<template>
  <div class="q-pa-md border-dashed q-mb-md">
    <div class="text-subtitle2 q-mb-sm text-grey-7">🔧 Painel de Debug & Mock</div>
    <div class="row q-col-gutter-sm justify-center">
      <div class="col-12 col-sm-4">
        <q-btn
          color="accent"
          icon="cloud_upload"
          label="Injetar Mocks de Rotina"
          :loading="loading"
          class="full-width text-weight-bold"
          @click="handleInjection"
        >
          <q-tooltip>Insere lições mockadas na sua rotina pessoal</q-tooltip>
        </q-btn>
      </div>

      <div class="col-12 col-sm-4">
        <q-btn
          color="primary"
          icon="library_books"
          label="Semear Acervo (/templates)"
          :loading="loadingTemplates"
          class="full-width text-weight-bold"
          @click="handleSeedTemplates"
        >
          <q-tooltip>Insere as lições padrões do acervo global</q-tooltip>
        </q-btn>
      </div>

      <div class="col-12 col-sm-4">
        <q-btn
          color="secondary"
          icon="admin_panel_settings"
          label="Tornar Admin (/admins)"
          :loading="loadingAdmin"
          class="full-width text-weight-bold"
          @click="handleMakeAdmin"
        >
          <q-tooltip>Torna seu usuário um administrador para testar rotas seguras</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { db, auth } from 'src/boot/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SINGING_ROUTINE_MOCKS } from 'src/mocks/RoutineMock';
import { DEFAULT_LESSONS } from 'src/data/defaultLessons';
import { useRoutineStore } from 'src/stores/routine-store';

const $q = useQuasar();
const loading = ref(false);
const loadingTemplates = ref(false);
const loadingAdmin = ref(false);
const routineStore = useRoutineStore();

const handleInjection = async () => {
  loading.value = true;
  try {
    for (const mock of SINGING_ROUTINE_MOCKS) {
      await routineStore.addTask(mock);
    }
    $q.notify({
      type: 'positive',
      message: `${SINGING_ROUTINE_MOCKS.length} rotinas pessoais injetadas com sucesso!`,
      position: 'top'
    });
  } catch (error) {
    console.error('Erro na injeção de mocks:', error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao injetar dados pessoais no Firebase.'
    });
  } finally {
    loading.value = false;
  }
};

const handleSeedTemplates = async () => {
  loadingTemplates.value = true;
  try {
    for (let i = 0; i < DEFAULT_LESSONS.length; i++) {
      const lesson = DEFAULT_LESSONS[i];
      // Salva com IDs fixados para evitar duplicatas indesejadas no acervo global
      await setDoc(doc(db, 'templates', `lesson_template_${i + 1}`), {
        ...lesson,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    $q.notify({
      type: 'positive',
      message: `${DEFAULT_LESSONS.length} templates semeados no acervo global (/templates)!`,
      position: 'top'
    });
  } catch (error) {
    console.error('Erro ao semear acervo:', error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao semear acervo global no Firebase. Verifique se está autenticado e as regras do banco.'
    });
  } finally {
    loadingTemplates.value = false;
  }
};

const handleMakeAdmin = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    $q.notify({
      type: 'warning',
      message: 'Você precisa estar logado para se tornar administrador!',
      position: 'top'
    });
    return;
  }

  loadingAdmin.value = true;
  try {
    await setDoc(doc(db, 'admins', currentUser.uid), {
      email: currentUser.email,
      isAdmin: true,
      updatedAt: new Date().toISOString()
    });
    $q.notify({
      type: 'positive',
      message: 'Usuário registrado como Administrador com sucesso no Firestore!',
      position: 'top'
    });
  } catch (error) {
    console.error('Erro ao tornar admin:', error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao registrar administrador no Firestore.'
    });
  } finally {
    loadingAdmin.value = false;
  }
};
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #ccc;
  border-radius: 12px;
}
</style>
