<template>
  <q-card
    class="shadow-4 q-mb-xl sticky-filters"
    style="border-radius: 16px; overflow: hidden;"
  >
    <q-card-section class="q-pa-sm">
      <div class="row q-col-gutter-sm items-center q-px-sm">

        <div class="col">
          <q-input
            v-model="filters.search"
            outlined
            dense
            placeholder="Pesquisar por termo"
            clearable
            class="search-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
        </div>

        <div class="col-auto">
          <q-btn
            flat
            round
            :color="isExpanded || hasActiveFilters ? 'primary' : 'grey-6'"
            icon="tune"
            @click="toggleFilters"
          >
            <q-badge v-if="hasActiveFilters" color="warning" floating rounded />
            <q-tooltip>Filtros Avançados</q-tooltip>
          </q-btn>
        </div>

      </div>
    </q-card-section>

    <div ref="advancedFiltersRef" class="advanced-filters-wrapper">
      <q-separator />
      <q-card-section class="row q-col-gutter-md q-pt-md">

        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filters.sortBy"
            :options="sortOptions"
            label="Ordenar por"
            outlined
            dense
            emit-value
            map-options
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="sort" />
            </template>
          </q-select>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filters.platform"
            :options="platformOptions"
            label="Plataforma"
            outlined
            dense
            emit-value
            map-options
            clearable
            options-dense
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-input v-model="filters.createdAt" outlined dense label="Criado em" clearable>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="filters.createdAt" mask="YYYY-MM-DD" color="primary" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-input v-model="filters.updatedAt" outlined dense label="Atualizado em" clearable>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="filters.updatedAt" mask="YYYY-MM-DD" color="secondary" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

      </q-card-section>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  modelValue: { type: Object, required: true }
});

const emit = defineEmits(['update:modelValue']);

// Garante que o sortBy tenha um valor padrão ao iniciar
const filters = ref({
  ...props.modelValue
});

watch(filters, (newVal) => emit('update:modelValue', newVal), { deep: true });

// --- OPÇÕES DE ORDENAÇÃO E PLATAFORMA ---
const sortOptions = [
  { label: 'Ordem do Treino (Manual)', value: 'manual' },
  { label: 'Mais Recentes', value: 'newest' },
  { label: 'Mais Antigos', value: 'oldest' },
  { label: 'Alfabética (A-Z)', value: 'alphabetical' },
  { label: 'Alfabética (Z-A)', value: 'reverse-alphabetical' }
];

const platformOptions = [
  { label: 'Todas', value: '' },
  { label: 'YouTube 🔴', value: 'youtube' },
  { label: 'Hotmart 🔥', value: 'hotmart' },
  { label: 'Udemy 🎓', value: 'udemy' },
  { label: 'Yousician 🎹', value: 'yousician' },
  { label: 'Outro 🔗', value: 'other' }
];

// --- LÓGICA DE UI E ANIMAÇÃO ---
const isExpanded = ref(false);
const advancedFiltersRef = ref<HTMLElement | null>(null);

// Lógica para saber se há algum filtro aplicado (ignorando a pesquisa em si)
const hasActiveFilters = computed(() => {
  return !!(
    filters.value.platform ||
    filters.value.createdAt ||
    filters.value.updatedAt ||
    filters.value.sortBy !== 'manual' // Só considera ativo se saiu do padrão
  );
});

onMounted(() => {
  if (advancedFiltersRef.value) {
    gsap.set(advancedFiltersRef.value, { height: 0, opacity: 0, overflow: 'hidden' });
  }
});

const toggleFilters = () => {
  if (!advancedFiltersRef.value) return;

  isExpanded.value = !isExpanded.value;

  if (isExpanded.value) {
    gsap.to(advancedFiltersRef.value, {
      height: 'auto',
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
  } else {
    gsap.to(advancedFiltersRef.value, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });
  }
};
</script>

<style scoped>
/* Transforma o Card em um componente "Grudento" (Sticky) */
.sticky-filters {
  position: sticky;
  top: 16px; /* Distância do topo da tela ao rolar */
  z-index: 100; /* Garante que fique por cima dos cards */
}

.advanced-filters-wrapper {
  overflow: hidden;
}

/* Um leve ajuste no input principal para tirar bordas internas sobressalentes */
.search-input :deep(.q-field__control) {
  border-radius: 8px;
}
</style>
