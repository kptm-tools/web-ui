import { RouteRecordRaw } from 'vue-router';
import { ROUTES_NAMES } from './routes-names';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: ROUTES_NAMES.home,
        meta: {
          title: 'Overview'
        },

        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'hosts',
        name: ROUTES_NAMES.hosts,
        meta: {
          title: 'Hosts'
        },
        component: () => import('pages/HostPage.vue')
      },
      {
        path: 'scans',
        name: ROUTES_NAMES.scans,
        meta: {
          title: 'Scans'
        },
        component: () => import('pages/ScanPage.vue')
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
      },
      {
        path: 'reset-password',
        name: ROUTES_NAMES.resetPassword,
        meta: {
          title: 'Reset Password'
        },
        component: () => import('pages/auth/ResetPasswordPage.vue')
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
