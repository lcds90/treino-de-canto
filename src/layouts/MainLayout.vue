<template>
  <q-layout view="h lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="flex items-center cursor-pointer" @click="handleTitleClick">
          <q-avatar class="q-mr-sm">
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          {{ $t('title') }} 🎤
        </q-toolbar-title>

        <q-space />

        <!-- Seletor de Idioma -->
        <q-btn round flat icon="translate" class="q-mr-sm">
          <q-menu auto-close>
            <q-list style="min-width: 150px">
              <q-item
                clickable
                @click="changeLocale('pt-BR')"
                :active="settingsStore.language === 'pt-BR'"
              >
                <q-item-section avatar style="min-width: auto; padding-right: 8px"
                  >🇧🇷</q-item-section
                >
                <q-item-section>Português</q-item-section>
              </q-item>
              <q-item
                clickable
                @click="changeLocale('en-US')"
                :active="settingsStore.language === 'en-US'"
              >
                <q-item-section avatar style="min-width: auto; padding-right: 8px"
                  >🇺🇸</q-item-section
                >
                <q-item-section>English</q-item-section>
              </q-item>
              <q-item
                clickable
                @click="changeLocale('es')"
                :active="settingsStore.language === 'es'"
              >
                <q-item-section avatar style="min-width: auto; padding-right: 8px"
                  >🇪🇸</q-item-section
                >
                <q-item-section>Español</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- User is Authenticated -->
        <div v-if="authStore.isAuthenticated" class="row items-center q-gutter-sm">
          <div class="text-caption text-weight-medium gt-xs q-mr-sm">
            {{ authStore.user?.email }}
          </div>
          <q-btn round flat>
            <q-avatar size="32px" color="secondary" text-color="white">
              {{ userEmailInitial }}
            </q-avatar>
            <q-menu transition-show="jump-down" transition-hide="jump-up" auto-close>
              <q-list style="min-width: 200px">
                <q-item-label header class="text-weight-bold">{{
                  $t('auth.myAccount')
                }}</q-item-label>
                <q-item class="gt-xs">
                  <q-item-section>
                    <q-item-label class="text-caption text-grey-8">{{
                      authStore.user?.email
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="text-negative" @click="handleLogout">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section>{{ $t('auth.logout') }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <!-- User is Anonymous (Not Authenticated) -->
        <div v-else class="row items-center q-gutter-sm">
          <q-btn
            v-if="route.name !== 'login'"
            flat
            :label="$t('auth.login')"
            icon="login"
            @click="goToLogin"
          />
          <q-btn
            v-if="route.name !== 'register'"
            flat
            :label="$t('auth.register')"
            icon="person_add"
            @click="goToRegister"
          />
        </div>
      </q-toolbar>

      <!-- Show tabs only when authenticated -->
      <q-tabs
        v-if="authStore.isAuthenticated"
        align="left"
        class="bg-primary text-white"
        active-color="white"
        indicator-color="secondary"
      >
        <q-tab
          v-for="link in linksList"
          :key="link.titleKey"
          :name="link.to"
          :label="$t(link.titleKey)"
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
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { useSettingsStore } from 'src/stores/settings-store';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const changeLocale = (lang: string) => {
  settingsStore.updateLanguage(lang);
};

const userEmailInitial = computed(() => {
  const email = authStore.user?.email || '';
  return email ? email.substring(0, 1).toUpperCase() : 'U';
});

const linksList = [
  {
    titleKey: 'menu.home',
    icon: 'home',
    to: '/',
  },
  {
    titleKey: 'menu.routine',
    icon: 'mic',
    to: '/treino',
  },
  {
    titleKey: 'menu.metronome',
    icon: 'av_timer',
    to: '/metronomo',
  },
];

const handleTabClick = (to: string) => {
  void router.push(to);
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    void router.push({ name: 'login' });
  } catch (error) {
    console.error('Erro ao efetuar logout:', error);
  }
};

const goToLogin = () => {
  void router.push({ name: 'login' });
};

const goToRegister = () => {
  void router.push({ name: 'register' });
};

const handleTitleClick = () => {
  if (authStore.isAuthenticated) {
    void router.push({ name: 'index' });
  }
};
</script>
