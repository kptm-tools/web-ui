import type { RouteRecordRaw } from 'vue-router';
import { ADMIN_ROUTES } from './route-names';

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('../AdminModule.vue'),
    meta: {
      requiresAuth: true,
      superAdmin: true
    },
    children: [
      {
        path: ADMIN_ROUTES.home.path,
        name: ADMIN_ROUTES.home.name,
        meta: {
          title: 'Admin Home'
        },
        component: () => import('../pages/AdminHome.vue')
      }
    ]
  }
];

export default routes;
