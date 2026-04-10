<template>
  <q-card class="shadow-4 workout-table-card q-mx-xl">
    <q-card-section class="bg-primary text-white row items-center q-pb-sm">
      <q-icon name="history" size="sm" class="q-mr-sm" />
      <div class="text-h6 text-weight-bold">Histórico de Treinos</div>
    </q-card-section>

    <q-table
      :rows="sortedSessions"
      :columns="columns"
      row-key="id"
      flat
      :pagination="{ rowsPerPage: 5 }"
      rows-per-page-label="Treinos por página:"
      no-data-label="Nenhum treino finalizado ainda. Comece a treinar! 💪"
      class="workout-table"
      @row-click="onRowClick"
    >
      <template v-slot:body-cell-date="props">
        <q-td :props="props">
          <div class="row items-center text-weight-medium">
            <q-icon name="calendar_today" size="xs" color="grey-6" class="q-mr-xs" />
            {{ formatDate(props.row.date) }}
          </div>
          <div class="text-caption">
            {{ formatTime(props.row.date) }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-metrics="props">
        <q-td :props="props">
          <div class="row q-gutter-x-sm items-center">
            <q-badge color="positive" rounded>
              {{ props.row.metrics.completed }} ✔️
              <q-tooltip>Completos</q-tooltip>
            </q-badge>
            <q-badge color="warning" rounded v-if="props.row.metrics.partial > 0">
              {{ props.row.metrics.partial }} ⚠️
              <q-tooltip>Parciais</q-tooltip>
            </q-badge>
            <span class="text-caption">de {{ props.row.metrics.total }}</span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-performance="props">
        <q-td :props="props">
          <div class="row items-center">
            <div class="col">
              <q-linear-progress
                :value="getPerformanceRatio(props.row.metrics)"
                :color="getPerformanceColor(props.row.metrics)"
                size="8px"
                rounded
                class="q-mt-xs"
              />
            </div>
            <div
              class="col-auto q-ml-sm text-caption text-weight-bold"
              :class="`text-${getPerformanceColor(props.row.metrics)}`"
            >
              {{ Math.round(getPerformanceRatio(props.row.metrics) * 100) }}%
            </div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            size="sm"
            class="q-mr-sm action-btn"
            @click.stop="confirmDelete(props.row)"
          >
            <q-tooltip>Excluir treino do histórico</q-tooltip>
          </q-btn>

          <q-btn flat round color="primary" icon="chevron_right" size="sm" class="action-btn">
            <q-tooltip>Ver detalhes do treino</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useWorkoutStore } from 'src/stores/workout-store';
import type { WorkoutMetrics } from 'src/components/models';

const router = useRouter();
const $q = useQuasar();
const workoutStore = useWorkoutStore();

const columns: any[] = [
  {
    name: 'date',
    required: true,
    label: 'Data e Hora',
    align: 'left',
    field: 'date',
    sortable: true,
  },
  { name: 'metrics', label: 'Exercícios', align: 'left', field: 'metrics' },
  { name: 'performance', label: 'Performance', align: 'left', field: 'metrics' },
  { name: 'actions', label: '', align: 'right' },
];

const sortedSessions = computed(() => {
  return [...workoutStore.sessions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

const onRowClick = (evt: Event, row: any) => {
  if (row.id) {
    router.push(`/treino/${row.id}`);
  }
};

// --- FUNÇÃO DE DELETAR ---
const confirmDelete = (session: any) => {
  $q.dialog({
    title: 'Excluir Histórico',
    message: `Tem certeza que deseja apagar o registro do treino de <strong>${formatDate(session.date)}</strong>? <br>Essa ação não pode ser desfeita.`,
    html: true,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    if (session.id) {
      workoutStore.removeSessionAction(session.id);
    }
  });
};

const getPerformanceRatio = (metrics: WorkoutMetrics) => {
  if (metrics.total === 0) return 0;
  const score = metrics.completed + metrics.partial * 0.5;
  return score / metrics.total;
};

const getPerformanceColor = (metrics: WorkoutMetrics) => {
  const ratio = getPerformanceRatio(metrics);
  if (ratio >= 0.8) return 'positive';
  if (ratio >= 0.4) return 'warning';
  return 'negative';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
};
</script>

<style scoped>
.workout-table-card {
  border-radius: 16px;
  overflow: hidden;
}

.workout-table :deep(tbody tr) {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.workout-table :deep(tbody tr:hover) {
  filter: brightness(0.98);
}

/* Evita que o hover do botão pareça estranho em cima da linha clicável */
.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
