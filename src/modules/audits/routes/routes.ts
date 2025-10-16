import type { RouteRecordRaw } from 'vue-router';
import { AUDITS_ROUTES } from './route-names';

const routes: RouteRecordRaw[] = [
  {
    path: '/audits',
    component: () => import('../AuditsModule.vue'),
    children: [
      {
        path: AUDITS_ROUTES.home.path,
        name: AUDITS_ROUTES.home.name,
        meta: {
          title: 'Audits Home'
        },
        component: () => import('../pages/AuditsHome.vue')
      },
      {
        path: AUDITS_ROUTES.functions.path,
        name: AUDITS_ROUTES.functions.name,
        meta: {
          title: 'Audits Functions'
        },
        component: () => import('../pages/AdminFunctionView.vue')
      },
      {
        path: AUDITS_ROUTES.dashboard.path,
        name: AUDITS_ROUTES.dashboard.name,
        meta: {
          title: 'Admin Home',
          requiresAuth: true,
          superAdmin: true
        },
        component: () => import('../pages/AdminHome.vue')
      }
    ]
  }
];

export default routes;
