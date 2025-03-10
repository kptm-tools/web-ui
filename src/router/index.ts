import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';
import { useFusionAuthStore } from 'stores/auth-store';

import routes from './routes';
import { UserService } from 'src/services';
import { decodeJwt } from 'src/utils/auth.utils';
import { AxiosError } from 'axios';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  const authStore = useFusionAuthStore();

  Router.beforeEach(async (to, from, next) => {
    const accessToken = sessionStorage.getItem('access_token') || '';
    const tokenExpirationInstant =
      Number(sessionStorage.getItem('token_expiration_instant')) || 0;

    authStore.setTokenInfo(accessToken, tokenExpirationInstant);
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!authStore.isAuthenticated) {
        next({ name: 'Login' });
      } else {
        try {
          const response = await UserService.getUser(
            decodeJwt(accessToken).sub
          );
          authStore.setUserInfo({
            token: accessToken,
            tokenExpirationInstant,
            user: response.data
          });
          return next();
        } catch (error) {
          const errorAxios = error as AxiosError;
          if (errorAxios.status === 401) {
            next({ name: 'Login' });
          }
          console.log(errorAxios.status);
          console.error('Error fetching user data:', error);
        }
        next(); // go to wherever I'm going
      }
    } else {
      next(); // does not require auth, make sure to always call next()!
    }
  });

  Router.afterEach(to => {
    document.title = to.meta.title as string;
  });

  return Router;
});
