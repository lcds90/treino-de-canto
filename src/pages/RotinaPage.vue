<template>
  <q-page class="bg-grey-1 q-pa-md">

    <div ref="backBtnRef" class="q-mb-sm">
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Voltar ao Início"
        to="/"
        class="text-weight-bold no-hover-effect"
      />
    </div>

    <div ref="headerRef" class="text-center q-mb-xl">
      <h1 class="text-h4 text-weight-bold text-primary q-mb-sm">
        🎧 Hora de Soltar a Voz! 🎶
      </h1>
      <p class="text-subtitle1 text-grey-7">
        Siga as instruções de cada vídeo e marque os exercícios concluídos.
      </p>
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <div
        v-for="(task, index) in routineTasks"
        :key="task.id"
        class="col-12 col-md-8 col-lg-6"
      >
        <q-card :ref="el => setCardRef(el, index)" class="routine-card shadow-4 text-left">

          <q-card-section class="bg-secondary text-white">
            <div class="text-h6 text-weight-bold">{{ task.title }}</div>
          </q-card-section>

          <q-video
            :src="task.videoUrl"
            :ratio="16/9"
          />

          <q-card-section>
            <div class="text-subtitle2 text-primary q-mb-sm">
              📝 Instruções:
            </div>
            <p class="text-body1 text-grey-8">
              {{ task.instructions }}
            </p>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 text-primary q-mb-md">
              ✅ Checklist de Hoje:
            </div>

            <q-list dense>
              <q-item
                v-for="item in task.checklist"
                :key="item.id"
                tag="label"
                v-ripple
                class="checklist-item q-mb-sm rounded-borders"
                :class="{ 'bg-green-1': item.done }"
              >
                <q-item-section avatar>
                  <q-checkbox v-model="item.done" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    class="text-body1"
                    :class="{ 'text-strike text-grey-5': item.done }"
                  >
                    {{ item.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        ref="fabRef"
        fab
        icon="check"
        color="positive"
        label="Finalizar Treino 🏆"
        class="shadow-5"
        @click="finishRoutine"
      />
    </q-page-sticky>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()

// --- TIPAGENS (TypeScript) ---
interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

interface RoutineTask {
  id: string
  title: string
  videoUrl: string
  instructions: string
  checklist: ChecklistItem[]
}

// --- DADOS ---
const routineTasks = ref<RoutineTask[]>([
  {
    id: '1',
    title: '1. Aquecimento Vocal Básico 🗣️',
    videoUrl: 'https://www.youtube.com/embed/a3Z7zEc7AXQ',
    instructions: 'Antes de começarmos a forçar, assista ao vídeo e acompanhe os exercícios de respiração e vibração. É crucial não pular essa etapa!',
    checklist: [
      { id: 'c1', label: 'Lip Trill (Vibração de lábios) - 2 minutos', done: false },
      { id: 'c2', label: 'Sirene Vocal ascendente e descendente - 5x', done: false }
    ]
  },
  {
    id: '2',
    title: '2. Treino de Afinação e Escalas 🎹',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructions: 'Acompanhe as notas do piano no vídeo. Foque em manter a laringe estável e não tencionar o pescoço.',
    checklist: [
      { id: 'c3', label: 'Escala maior em "Muu" - Subir e descer', done: false },
      { id: 'c4', label: 'Arpejos em "Ahh" - Atenção à passagem vocal', done: false }
    ]
  }
])

// --- REFERÊNCIAS DO DOM (GSAP) ---
const backBtnRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const fabRef = ref<any | null>(null)

// Vetor dinâmico para armazenar os cartões gerados no v-for
const cardsRefs = ref<HTMLElement[]>([])

const setCardRef = (el: any, index: number) => {
  if (el) {
    cardsRefs.value[index] = el.$el
  }
}

// --- ANIMAÇÕES E CICLO DE VIDA ---
onMounted(() => {
  if (!headerRef.value || !fabRef.value || !backBtnRef.value) return

  const tl = gsap.timeline()

  // 1. Anima o botão de voltar surgindo da esquerda
  tl.from(backBtnRef.value, {
    x: -20,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
  })

  // 2. Anima o cabeçalho descendo
  tl.from(headerRef.value, {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.3') // Inicia levemente antes da anterior terminar

  // 3. Anima os cartões entrando um por um (Stagger)
  if (cardsRefs.value.length > 0) {
    tl.from(cardsRefs.value, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'back.out(1.2)'
    }, '-=0.4')
  }

  // 4. Anima o botão flutuante de conclusão surgindo
  tl.from(fabRef.value.$el, {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.7)'
  }, '-=0.2')
})

// --- MÉTODOS ---
const finishRoutine = () => {
  if (!fabRef.value) return

  const fabEl = fabRef.value.$el

  // Animação de sucesso no botão
  gsap.to(fabEl, {
    scale: 1.1,
    duration: 0.15,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      console.log('🎉 Treino finalizado! Salvando no Firestore...')
      // router.push('/acompanhamento')
    }
  })
}
</script>

<style scoped>
.routine-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.routine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.checklist-item {
  transition: background-color 0.3s ease;
  border: 1px solid transparent;
}

.checklist-item:hover {
  background-color: #f5f5f5;
  border-color: #e0e0e0;
}

/* Evita que o fundo do botão flat fique escuro demais no hover, mantendo-o limpo */
.no-hover-effect:hover {
  background: transparent !important;
  opacity: 0.8;
}
</style>
