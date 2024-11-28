import { fusionAuthApi } from 'src/boot/axios';
import {
  FusionAuthLoginBody,
  FusionAuthLoginHeaders,
  FusionAuthLoginResponse,
  FusionAuthLogout,
  FusionAuthLogoutHeaders,
} from 'src/models/fusion-auth.models';
import { AxiosResponse } from 'axios';

export function authenticateUser(
  body: FusionAuthLoginBody,
  headers?: FusionAuthLoginHeaders
): Promise<AxiosResponse<FusionAuthLoginResponse>> {
  console.log('header Service', headers);
  return fusionAuthApi.post<FusionAuthLoginResponse>('/api/login', body, {
    headers: {
      Authorization:
        'this_really_should_be_a_long_random_alphanumeric_value_but_this_still_work',
    },
  });
}

export function logoutUser(
  body?: FusionAuthLogout,
  headers?: FusionAuthLogoutHeaders
): Promise<AxiosResponse<void>> {
  return fusionAuthApi.post<void>('/api/logout', body, { headers });
}
