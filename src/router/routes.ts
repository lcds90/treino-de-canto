import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'treino',
        meta: { requiresAuth: true },
        children: [
          { path: '', name: 'routine', component: () => import('pages/RotinaPage.vue') },
          { path: ':id', name: 'routine-detail', component: () => import('pages/RotinaPage.vue') },
        ],
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'cadastro',
        name: 'register',
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'metronomo',
        name: 'metronome',
        component: () => import('pages/MetronomePage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
