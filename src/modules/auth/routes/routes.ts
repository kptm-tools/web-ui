import type { RouteRecordRaw } from 'vue-router';
import { AUTH_ROUTES } from './route-names';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('auth/AuthModule.vue'),
    children: [
      {
        path: AUTH_ROUTES.login.path,
        name: AUTH_ROUTES.login.name,
        meta: {
          title: 'Login'
        },
        component: () => import('auth/pages/LoginPage.vue')
      },
      {
        path: AUTH_ROUTES.registerUser.path,
        name: AUTH_ROUTES.registerUser.name,
        meta: {
          title: 'Register'
        },
        component: () => import('auth/pages/CreateUserPage.vue')
      },
      {
        path: AUTH_ROUTES.registerUser.path,
        name: AUTH_ROUTES.recoverPassword.name,
        meta: {
          title: 'Recover Password'
        },
        component: () => import('auth/pages/ChangePasswordPage.vue')
      },
      {
        path: AUTH_ROUTES.registerUser.path,
        name: AUTH_ROUTES.resetPassword.name,
        meta: {
          title: 'Reset Password'
        },
        component: () => import('auth/pages/ResetPasswordPage.vue')
      },
      {
        path: AUTH_ROUTES.registerUser.path,
        name: AUTH_ROUTES.verifyEmail.name,
        meta: {
          title: 'Verify Email'
        },
        component: () => import('auth/pages/VerifyEmailPage.vue')
      }
    ]
  }
];

export default routes;
