import { AxiosResponse } from 'axios';
import { SuccessAuthLoginUser } from 'src/models/fusion-auth.models';
import { fusionAuthApi } from 'boot/axios';

const BASE_PATH = '/api/user';

export function getUser(
  userId: string
): Promise<AxiosResponse<SuccessAuthLoginUser>> {
  return fusionAuthApi.get<SuccessAuthLoginUser>(`${BASE_PATH}/${userId}`);
}
