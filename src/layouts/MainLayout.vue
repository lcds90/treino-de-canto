<template>
  <q-layout view="h lpR fFf">

    <q-header v-if="false" elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Rotina de canto 🎤
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs v-if="false" align="left" class="bg-primary text-white" active-color="white" indicator-color="white">
        <q-tab
          v-for="link in linksList"
          :key="link.title"
          :name="link.to"
          :label="link.title"
          :icon="link.icon"
          class="text-weight-medium"
          @click="handleTabClick(link.to)"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
const linksList = [
  {
    title: 'Início',
    caption: 'Página inicial',
    icon: 'home',
    to: '/'
  },
  {
    title: 'Rotina',
    caption: 'Exercícios e vídeos',
    icon: 'mic', // Ícone de microfone para a rotina de canto
    to: '/rotina'
  },
  {
    title: 'Acompanhamento',
    caption: 'Sua ofensiva e progresso',
    icon: 'local_fire_department',
    to: '/acompanhamento'
  }
];
const handleTabClick = (to: string) => {
  void router.push(to);
};
</script>
