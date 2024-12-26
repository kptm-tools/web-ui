import { RouteRecordRaw } from 'vue-router';
import { ROUTES_NAMES } from './routes-names';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: ROUTES_NAMES.home,
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: 'login',
        name: ROUTES_NAMES.login,
        meta: {
          title: 'Login'
        },
        component: () => import('pages/auth/LoginPage.vue')
      },
      {
        path: 'register',
        name: ROUTES_NAMES.registerUser,
        meta: {
          title: 'Register'
        },
        component: () => import('pages/auth/CreateUserPage.vue')
      },
      {
        path: 'recover-password',
        name: ROUTES_NAMES.recoverPassword,
        meta: {
          title: 'Recover Password'
        },
        component: () => import('pages/auth/ChangePasswordPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
