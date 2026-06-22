<template>
  <q-dialog v-model="isOpen" position="standard" max-width="800px" full-width>
    <q-card class="library-dialog-card shadow-24">
      <!-- Header -->
      <q-card-section class="bg-gradient text-white row items-center q-pb-md">
        <q-avatar icon="library_books" color="white" text-color="secondary" class="q-mr-sm" />
        <div>
          <div class="text-h5 text-weight-bold">Biblioteca de Canto</div>
          <div class="text-caption text-grey-3">Escolha exercícios pré-definidos para importar para sua rotina</div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="text-white" />
      </q-card-section>

      <!-- Tabs de Categoria -->
      <q-tabs
        v-model="currentTab"
        dense
        class="text-grey-7 bg-grey-1"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="all" label="Todos" icon="apps" />
        <q-tab name="aquecimento" label="Aquecimento" icon="vocal_port" />
        <q-tab name="respiracao" label="Respiração" icon="air" />
        <q-tab name="articulacao" label="Articulação" icon="record_voice_over" />
        <q-tab name="desaquecimento" label="Desaquecer" icon="spa" />
      </q-tabs>

      <q-separator />

      <!-- Loading State -->
      <q-card-section v-if="routineStore.isLoading" class="text-center q-pa-xl">
        <q-spinner-dots color="secondary" size="40px" />
        <div class="text-grey-6 q-mt-sm">Carregando acervo de lições...</div>
      </q-card-section>

      <!-- Empty State se não houver itens -->
      <q-card-section v-else-if="filteredTemplates.length === 0" class="text-center q-pa-xl">
        <q-icon name="sentiment_dissatisfied" size="3rem" color="grey-5" />
        <div class="text-h6 text-grey-6 q-mt-md">Nenhuma lição encontrada nesta categoria</div>
      </q-card-section>

      <!-- Lista de Templates -->
      <q-card-section v-else class="q-pa-none scroll-container">
        <q-list separator>
          <q-expansion-item
            v-for="temp in filteredTemplates"
            :key="temp.id || temp.title"
            group="library-group"
            header-class="text-weight-bold text-dark text-subtitle1 q-py-md"
            expand-icon-class="text-secondary"
          >
            <!-- Custom Header -->
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon
                  :name="getPlatformIcon(temp.platform)"
                  :color="temp.platform === 'youtube' ? 'negative' : 'secondary'"
                  size="2rem"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ temp.title }}</q-item-label>
                <q-item-label caption class="text-grey-6 text-capitalize">
                  Categoria: {{ translateCategory(getCategory(temp.title)) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  color="secondary"
                  unelevated
                  rounded
                  label="Adicionar"
                  icon="add"
                  :loading="importingId === temp.id"
                  @click.stop="handleImport(temp)"
                  class="import-btn text-weight-bold"
                />
              </q-item-section>
            </template>

            <!-- Expanded Body -->
            <q-card class="bg-grey-1 q-mx-md q-mb-md rounded-borders shadow-1 border-light">
              <q-card-section>
                <div class="text-subtitle2 text-weight-bold text-secondary q-mb-xs">Instruções de Treino:</div>
                <div class="text-body2 text-grey-8 q-mb-md whitespace-pre-line">
                  {{ temp.instructions || 'Nenhuma instrução cadastrada para esta lição.' }}
                </div>

                <div v-if="temp.mediaUrl" class="q-mb-md">
                  <span class="text-subtitle2 text-weight-bold text-secondary">Link de Apoio:</span>
                  <a :href="temp.mediaUrl" target="_blank" class="text-blue q-ml-xs text-weight-bold text-body2 break-all">
                    {{ temp.mediaUrl }}
                  </a>
                </div>

                <div class="text-subtitle2 text-weight-bold text-secondary q-mb-sm">Checklist de Tarefas:</div>
                <q-list dense class="bg-white rounded-borders border-all">
                  <q-item v-for="check in temp.checklist" :key="check.id" class="q-py-sm">
                    <q-item-section avatar>
                      <q-icon name="radio_button_unchecked" color="grey-5" size="1.2rem" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-8">{{ check.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <!-- Footer -->
      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn flat label="Fechar" color="grey-7" v-close-popup class="text-weight-bold" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoutineStore } from 'src/stores/routine-store';
import type { RoutineTask } from './models';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'imported']);

const $q = useQuasar();
const routineStore = useRoutineStore();

const currentTab = ref('all');
const importingId = ref<string | null>(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// Ao abrir o modal, carrega os templates do Firestore
watch(isOpen, async (newVal) => {
  if (newVal) {
    await routineStore.fetchTemplates();
  }
});

onMounted(async () => {
  if (isOpen.value) {
    await routineStore.fetchTemplates();
  }
});

// Lógica de categorização dinâmica com base no título
const getCategory = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('aquecimento')) return 'aquecimento';
  if (t.includes('respira') || t.includes('sopro') || t.includes('apoio')) return 'respiracao';
  if (t.includes('articula') || t.includes('dic') || t.includes('trava')) return 'articulacao';
  if (t.includes('desaquecimento') || t.includes('cool')) return 'desaquecimento';
  return 'outros';
};

const translateCategory = (cat: string): string => {
  switch (cat) {
    case 'aquecimento': return 'Aquecimento Vocal';
    case 'respiracao': return 'Respiração e Apoio';
    case 'articulacao': return 'Articulação e Dicção';
    case 'desaquecimento': return 'Desaquecimento/Cool-down';
    default: return 'Outros';
  }
};

const getPlatformIcon = (platform: string): string => {
  switch (platform) {
    case 'youtube': return 'play_circle';
    case 'hotmart': return 'local_fire_department';
    case 'udemy': return 'school';
    case 'yousician': return 'music_note';
    default: return 'link';
  }
};

// Filtro dos templates pela aba selecionada
const filteredTemplates = computed(() => {
  if (currentTab.value === 'all') {
    return routineStore.templates;
  }
  return routineStore.templates.filter(
    (temp) => getCategory(temp.title) === currentTab.value
  );
});

// Ação de importar a lição selecionada
const handleImport = async (template: RoutineTask) => {
  importingId.value = template.id || template.title;
  try {
    await routineStore.importTaskFromTemplate(template);
    $q.notify({
      type: 'positive',
      message: `"${template.title}" adicionado à sua rotina!`,
      position: 'top',
      timeout: 2000
    });
    emit('imported');
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao importar lição para sua rotina.'
    });
  } finally {
    importingId.value = null;
  }
};
</script>

<style scoped>
.library-dialog-card {
  border-radius: 20px;
  overflow: hidden;
}

.bg-gradient {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

.scroll-container {
  max-height: 60vh;
  overflow-y: auto;
}

.import-btn {
  border-radius: 8px;
  padding: 4px 12px;
}

.rounded-borders {
  border-radius: 12px;
}

.border-light {
  border: 1px solid #eaeaea;
}

.border-all {
  border: 1px solid #e0e0e0;
}

.break-all {
  word-break: break-all;
}

.whitespace-pre-line {
  white-space: pre-line;
}
</style>
