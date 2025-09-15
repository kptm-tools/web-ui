import type { RouteRecordRaw } from 'vue-router';
import { SHARED_ROUTES } from './route-names';

const sharedRoutes: RouteRecordRaw[] = [
  // Always leave this as last one,
  // but you can also remove it
  {
    path: SHARED_ROUTES.selectModule.path,
    name: SHARED_ROUTES.selectModule.name,
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
