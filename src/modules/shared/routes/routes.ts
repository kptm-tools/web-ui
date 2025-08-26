import type { RouteRecordRaw } from 'vue-router';

const sharedRoutes: RouteRecordRaw[] = [
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/select-module',
    component: () => import('../pages/SelectModule.vue'),
    meta: {
      title: 'Select Module'
    }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('shared/pages/ErrorNotFound.vue')
  }
];

export default sharedRoutes;
