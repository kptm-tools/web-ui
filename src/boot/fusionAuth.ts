import { boot } from 'quasar/wrappers';
import FusionAuthVuePlugin from '@fusionauth/vue-sdk';

export default boot(({ app }) => {
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  const FUSION_AUTH_CLIENT_ID =
    process.env.FUSION_AUTH_CLIENT_ID || 'e9fdb985-9173-4e01-9d73-ac2d60d1dc8e';
  const FUSION_SERVER_URL =
    process.env.FUSION_SERVER_URL || 'http://localhost:9011';
  const FUSION_SCOPE =
    process.env.FUSION_SCOPE || 'openid email profile offline_access';

  app.use(FusionAuthVuePlugin, {
    clientId: FUSION_AUTH_CLIENT_ID,
    serverUrl: FUSION_SERVER_URL,
    redirectUri: CLIENT_URL,
    postLogoutRedirectUri: CLIENT_URL + '/logged-out',
    shouldAutoFetchUserInfo: true,
    shouldAutoRefresh: true,
    scope: FUSION_SCOPE,
  });
});
