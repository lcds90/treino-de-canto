<template>
  <div
    class="youtube-player-wrapper text-center relative-position bg-black"
    style="aspect-ratio: 16 / 9; overflow: hidden; border-radius: 8px;"
  >
    <!-- Spinner de Carregamento -->
    <div v-if="isLoading && !isFallback" class="absolute-center text-white text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm text-caption text-weight-bold">Carregando reprodutor...</div>
    </div>

    <!-- Fallback convencional se a API falhar -->
    <q-video
      v-if="isFallback"
      :src="getEmbedUrl(props.mediaUrl)"
      :ratio="16 / 9"
    />

    <!-- Contêiner de Injeção do Iframe do YouTube -->
    <div
      v-else
      :id="`yt-player-${props.taskId}`"
      style="width: 100%; height: 100%;"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import YouTubePlayer from 'youtube-player';

const props = defineProps<{
  mediaUrl: string;
  taskId: string;
}>();

const emit = defineEmits<{
  (e: 'ready'): void;
  (e: 'ended'): void;
}>();

const isLoading = ref(true);
const isFallback = ref(false);
const playerInstance = ref<any>(null);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

// --- EXTRATOR DE ID DO YOUTUBE ---
const extractVideoId = (url?: string): string => {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0] || '';
  }
  if (url.includes('embed/')) {
    return url.split('embed/')[1]?.split('?')[0] || '';
  }
  if (url.includes('watch?v=')) {
    return url.split('watch?v=')[1]?.split('&')[0] || '';
  }
  return '';
};

const getEmbedUrl = (url?: string): string => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const videoId = extractVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

// --- MÉTODO SEEKTO EXPOSTO ---
const seekTo = (seconds: number) => {
  if (isFallback.value) {
    console.warn('O player do YouTube está rodando em modo de fallback estático.seekTo indisponível.');
    return;
  }
  if (playerInstance.value) {
    playerInstance.value.seekTo(seconds, true);
    playerInstance.value.playVideo();
  }
};

defineExpose({ seekTo });

onMounted(() => {
  const videoId = extractVideoId(props.mediaUrl);
  if (!videoId) {
    isFallback.value = true;
    isLoading.value = false;
    return;
  }

  // Timeout de segurança de 5 segundos para fallback automático
  timeoutId = setTimeout(() => {
    if (isLoading.value) {
      isFallback.value = true;
      isLoading.value = false;
      console.warn('Timeout ao inicializar a YouTube Player API. Usando fallback estático.');
    }
  }, 5000);

  try {
    const player = YouTubePlayer(`yt-player-${props.taskId}`, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        rel: 0,
        enablejsapi: 1,
        origin: window.location.origin,
      },
    });

    playerInstance.value = player;

    player.on('ready', () => {
      isLoading.value = false;
      if (timeoutId) clearTimeout(timeoutId);
      emit('ready');
    });

    player.on('stateChange', (event: any) => {
      // 0 = YT.PlayerState.ENDED
      if (event.data === 0) {
        emit('ended');
      }
    });

    player.on('error', (err: any) => {
      console.error('Erro na API do Player do YouTube:', err);
      isFallback.value = true;
      isLoading.value = false;
      if (timeoutId) clearTimeout(timeoutId);
    });
  } catch (err) {
    console.error('Falha ao instanciar o YouTubePlayer:', err);
    isFallback.value = true;
    isLoading.value = false;
    if (timeoutId) clearTimeout(timeoutId);
  }
});

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId);
  if (playerInstance.value) {
    try {
      playerInstance.value.destroy();
    } catch (err) {
      console.error('Erro ao destruir player do YouTube:', err);
    }
  }
});
</script>

<style scoped>
.youtube-player-wrapper {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
