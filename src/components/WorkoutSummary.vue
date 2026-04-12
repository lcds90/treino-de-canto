<template>
  <q-card
    flat
    bordered
    class="q-mt-md q-mb-xl q-mx-auto"
    style="max-width: 600px; border-radius: 16px;"
    :class="$q.dark.isActive ? 'bg-dark border-grey-9' : 'bg-grey-1 border-grey-3'"
  >
    <q-card-section>
      <div class="row items-center justify-between text-center q-col-gutter-sm">

        <div class="col-12 col-sm-4" v-if="session?.timing">
          <div class="text-caption text-uppercase text-weight-bold text-grey-6">Duração</div>
          <div class="text-h6 text-weight-bold flex flex-center">
            <q-icon name="timer" size="sm" class="q-mr-xs text-primary" />
            {{ formattedDuration }}
          </div>
        </div>

        <div class="col-6 col-sm-4">
          <div class="text-caption text-uppercase text-weight-bold text-grey-6">Completos</div>
          <div class="text-h6 text-weight-bold flex flex-center text-positive">
            <q-icon name="check_circle" size="sm" class="q-mr-xs" />
            {{ session?.metrics?.completed || 0 }}
            <span class="text-caption text-grey-6 q-ml-xs">/ {{ session?.metrics?.total || 0 }}</span>
          </div>
        </div>

        <div class="col-6 col-sm-4">
          <div class="text-caption text-uppercase text-weight-bold text-grey-6">Parciais</div>
          <div class="text-h6 text-weight-bold flex flex-center text-warning">
            <q-icon name="star_half" size="sm" class="q-mr-xs" />
            {{ session?.metrics?.partial || 0 }}
          </div>
        </div>

      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { WorkoutSession } from './models';

const props = defineProps<{
  session: WorkoutSession | undefined;
}>();

const formattedDuration = computed(() => {
  if (!props.session?.timing?.durationSeconds) return '00:00';

  const totalSeconds = props.session.timing.durationSeconds;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');

  if (h > 0) return `${h.toString().padStart(2, '0')}:${m}:${s}`;
  return `${m}:${s}`;
});
</script>

<style scoped>
.border-grey-9 { border-color: #424242 !important; }
.border-grey-3 { border-color: #e0e0e0 !important; }
</style>
