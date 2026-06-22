<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl q-mt-sm">
      <div class="row items-center">
        <q-btn flat round color="primary" icon="arrow_back" to="/" class="q-mr-md">
          <q-tooltip>Voltar para a Rotina</q-tooltip>
        </q-btn>
        <div>
          <h1 class="text-h4 text-weight-bold text-primary q-my-none">🔑 Gestão do Acervo</h1>
          <p class="text-caption text-grey-7 q-mb-none">Painel de gerenciamento de lições e exercícios padrões do sistema</p>
        </div>
      </div>
      <q-btn
        color="secondary"
        icon="add"
        label="Novo Template"
        unelevated
        class="text-weight-bold q-py-sm shadow-2"
        @click="openCreateModal"
      />
    </div>

    <!-- Tabela de Templates -->
    <q-card class="shadow-6 border-radius-16 overflow-hidden">
      <q-table
        :rows="routineStore.templates"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :loading="routineStore.isLoading"
        no-data-label="Nenhum template cadastrado no acervo"
        loading-label="Carregando templates do Firestore..."
        :pagination="initialPagination"
      >
        <!-- Custom Cell: Platform -->
        <template v-slot:body-cell-platform="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="getPlatformColor(props.row.platform)"
              text-color="white"
              class="text-weight-medium text-capitalize"
            >
              {{ props.row.platform }}
            </q-chip>
          </q-td>
        </template>

        <!-- Custom Cell: Checklist Count -->
        <template v-slot:body-cell-checklist="props">
          <q-td :props="props">
            <q-badge color="grey-7" text-color="white" class="text-weight-bold">
              {{ props.row.checklist ? props.row.checklist.length : 0 }} itens
            </q-badge>
          </q-td>
        </template>

        <!-- Custom Cell: Actions -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              size="sm"
              @click="openEditModal(props.row)"
            >
              <q-tooltip>Editar Template</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Remover Template</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal Form: Criar / Editar Template -->
    <q-dialog v-model="isFormOpen" persistent max-width="600px" full-width>
      <q-card class="border-radius-16">
        <q-card-section class="bg-gradient text-white row items-center">
          <q-avatar icon="edit_note" color="white" text-color="primary" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold">
            {{ isEditing ? 'Editar Template de Lição' : 'Criar Novo Template' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-white" />
        </q-card-section>

        <q-card-section class="q-pa-md scroll" style="max-height: 65vh;">
          <q-form ref="formRef" @submit="saveTemplate" class="q-gutter-md">
            <!-- Título -->
            <q-input
              v-model="formData.title"
              label="Título do Exercício *"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || 'O título é obrigatório']"
            />

            <div class="row q-col-gutter-sm">
              <!-- Plataforma -->
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="formData.platform"
                  :options="platformOptions"
                  label="Plataforma de Apoio *"
                  outlined
                  dense
                  emit-value
                  map-options
                  lazy-rules
                  :rules="[val => !!val || 'A plataforma é obrigatória']"
                />
              </div>

              <!-- Ordem -->
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="formData.order"
                  type="number"
                  label="Ordem de Exibição"
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- URL de Mídia -->
            <q-input
              v-model="formData.mediaUrl"
              label="URL do Vídeo / Áudio (Opcional)"
              outlined
              dense
              placeholder="https://www.youtube.com/watch?..."
            />

            <!-- Instruções -->
            <q-input
              v-model="formData.instructions"
              type="textarea"
              label="Instruções de Treino *"
              outlined
              dense
              rows="4"
              lazy-rules
              :rules="[val => !!val || 'Insira instruções de treino']"
            />

            <!-- Checklist Builder -->
            <div class="border-all rounded-borders q-pa-md bg-grey-2">
              <div class="text-subtitle2 text-weight-bold text-secondary q-mb-sm">Checklist de Tarefas</div>
              
              <!-- Input para adicionar item -->
              <div class="row q-col-gutter-sm items-center q-mb-md">
                <div class="col">
                  <q-input
                    v-model="newCheckItemText"
                    placeholder="Adicionar tarefa ao checklist (ex: Vibração de língua - 2 min)"
                    outlined
                    dense
                    @keyup.enter="addChecklistItem"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    color="secondary"
                    icon="add"
                    round
                    unelevated
                    @click="addChecklistItem"
                  />
                </div>
              </div>

              <!-- Lista de itens do checklist -->
              <q-list v-if="formData.checklist.length > 0" bordered separator class="bg-white rounded-borders">
                <q-item v-for="(item, index) in formData.checklist" :key="item.id || index" class="q-py-xs">
                  <q-item-section avatar>
                    <q-icon name="drag_indicator" color="grey-5" size="1.2rem" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2 text-grey-8">{{ item.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="close"
                      size="sm"
                      @click="removeChecklistItem(index)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-caption text-grey-6 text-center q-py-sm">
                Nenhum item adicionado à checklist
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <!-- Ações do Modal -->
        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="text-weight-bold" />
          <q-btn
            unelevated
            label="Salvar Template"
            color="primary"
            class="text-weight-bold"
            @click="submitForm"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoutineStore } from 'src/stores/routine-store';
import type { RoutineTask } from 'src/components/models';

const $q = useQuasar();
const routineStore = useRoutineStore();

const isFormOpen = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const newCheckItemText = ref('');
const formRef = ref<any>(null);

interface FormState {
  id?: string;
  title: string;
  platform: 'youtube' | 'udemy' | 'hotmart' | 'yousician' | 'other';
  mediaUrl: string;
  instructions: string;
  order: number;
  checklist: { id: string; label: string; done: boolean }[];
}

const initialForm = (): FormState => ({
  title: '',
  platform: 'youtube',
  mediaUrl: '',
  instructions: '',
  order: 1,
  checklist: []
});

const formData = ref<FormState>(initialForm());

onMounted(async () => {
  await routineStore.fetchTemplates();
});

// Configuração de paginação padrão
const initialPagination = {
  sortBy: 'order',
  descending: false,
  page: 1,
  rowsPerPage: 10
};

// Colunas da Tabela
const columns = [
  { name: 'order', label: 'Ordem', field: 'order', align: 'left', sortable: true },
  { name: 'title', label: 'Título', field: 'title', align: 'left', sortable: true },
  { name: 'platform', label: 'Plataforma', field: 'platform', align: 'left' },
  { name: 'checklist', label: 'Checklist', align: 'center' },
  { name: 'actions', label: 'Ações', align: 'center' }
] as any[];

const platformOptions = [
  { label: 'YouTube 🔴', value: 'youtube' },
  { label: 'Hotmart 🔥', value: 'hotmart' },
  { label: 'Udemy 🎓', value: 'udemy' },
  { label: 'Yousician 🎹', value: 'yousician' },
  { label: 'Outro 🔗', value: 'other' }
];

const getPlatformColor = (platform: string): string => {
  switch (platform) {
    case 'youtube': return 'negative';
    case 'hotmart': return 'orange-8';
    case 'udemy': return 'deep-purple-7';
    case 'yousician': return 'green-7';
    default: return 'grey-7';
  }
};

// --- MÉTODOS DO CRUD ---

const openCreateModal = () => {
  isEditing.value = false;
  formData.value = initialForm();
  // Configura a ordem padrão
  formData.value.order = routineStore.templates.length + 1;
  isFormOpen.value = true;
};

const openEditModal = (template: RoutineTask) => {
  isEditing.value = true;
  formData.value = {
    id: template.id,
    title: template.title,
    platform: template.platform,
    mediaUrl: template.mediaUrl,
    instructions: template.instructions,
    order: template.order || 1,
    checklist: template.checklist ? [...template.checklist] : []
  };
  isFormOpen.value = true;
};

const addChecklistItem = () => {
  const text = newCheckItemText.value.trim();
  if (!text) return;

  const itemIndex = formData.value.checklist.length + 1;
  formData.value.checklist.push({
    id: `temp_check_${Date.now()}_${itemIndex}`,
    label: text,
    done: false
  });

  newCheckItemText.value = '';
};

const removeChecklistItem = (index: number) => {
  formData.value.checklist.splice(index, 1);
};

const submitForm = () => {
  if (formRef.value) {
    formRef.value.submit();
  }
};

const saveTemplate = async () => {
  saving.value = true;
  try {
    if (isEditing.value && formData.value.id) {
      await routineStore.updateTemplate(formData.value as RoutineTask);
      $q.notify({ type: 'positive', message: 'Template de lição atualizado com sucesso!' });
    } else {
      await routineStore.createTemplate(formData.value);
      $q.notify({ type: 'positive', message: 'Novo template criado no acervo com sucesso!' });
    }
    isFormOpen.value = false;
  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'Erro ao salvar template.' });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (template: RoutineTask) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja realmente deletar a lição "${template.title}" do acervo global? Esta ação é irreversível e impedirá que novos usuários a importem.`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      if (template.id) {
        await routineStore.deleteTemplate(template.id);
        $q.notify({ type: 'positive', message: 'Template excluído com sucesso!' });
      }
    } catch (error) {
      console.error(error);
      $q.notify({ type: 'negative', message: 'Erro ao deletar template.' });
    }
  });
};
</script>

<style scoped>
.border-radius-16 {
  border-radius: 16px;
}

.bg-gradient {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
}

.border-all {
  border: 1px solid #e0e0e0;
}

.rounded-borders {
  border-radius: 12px;
}
</style>
