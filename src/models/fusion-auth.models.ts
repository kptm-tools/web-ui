import type { AxiosHeaders } from 'axios';

export interface FusionAuthLoginBody {
  application_id?: string;
  ipAddress?: string;
  loginId: string;
  metaData?: FusionAuthMetaData;
  noJWT?: boolean;
  password: string;
  twoFactorTrustId?: string;
  otp: string;
  tenantId?: string;
}

export type FusionAuthLoginResponse =
  | SuccessAuthLogin
  | SuccessAuthLoginChangePassword
  | SuccessAuthLoginTwoFactor
  | FusionAuthErrorResponse
  | ErrorAuthLoginPrevent
  | null;

export interface FusionAuthLoginHeaders extends AxiosHeaders {
  'X-Forwarded-For'?: string;
  'X-FusionAuth-TenantId'?: string;
}

export interface FusionAuthLogout {
  global?: boolean;
  refreshToken?: string;
}

export interface FusionAuthLogoutHeaders extends AxiosHeaders {
  'X-FusionAuth-TenantId'?: string;
}

interface FusionAuthMetaData {
  device: FusionAuthMetaDataDevice;
}

interface FusionAuthMetaDataDevice {
  description: string;
  lastAccessedAddress: string;
  lastAccessedInstant: string;
  name: string;
  type: FusionAuthDeviceType;
}

export interface ErrorAuthLoginPrevent {
  actions: FusionAuthAction[];
}

export interface SuccessAuthLoginChangePassword {
  changePasswordId: string;
  changePasswordReason: ChangePasswordReason;
}

export interface SuccessAuthLoginTwoFactor {
  methods: TwoFactorMethods[];
  twoFactorId: string;
}

export interface SuccessAuthLogin {
  token: string;
  tokenExpirationInstant: number;
  user: SuccessAuthLoginUser;
  otp: string;
  tenantId: string;
}

export interface SuccessAuthLoginUser {
  id: string;
  email: string;
  password: string;
  application_id: string;
  roles: string[];
  user: {
    name: string;
    lastname: string;
  };
}

export interface FusionAuthErrorResponse {
  generalErrors: ErrorDetail[];
  fieldErrors: FieldErrors;
}

export interface CreateUserBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  applicationId: string;
  roles: string[];
}

export interface VerifyEmailBody {
  verification_id: string;
}

export interface ChangePasswordBody {
  login_id: string;
  password: string;
  change_password_id: string;
  application_id: string;
}

export interface ForgotPasswordBody {
  login_id: string;
  application_id: string;
}

interface ErrorDetail {
  code: string;
  message: string;
}

interface FieldErrors {
  [field: string]: ErrorDetail[];
}

interface TwoFactorMethods {
  id: string;
  method: string;
  email?: string;
  authenticator?: {
    algorithm: string;
    codeLength: string;
    timeStep: string;
  };
}

interface FusionAuthAction {
  actionId: string;
  actionerUserId: string;
  expiry: number;
  localizedName: string;
  localizedReason: string;
  name: string;
  reason: string;
  reasonCode: string;
}

type ChangePasswordReason = 'Administrative' | 'Breached' | 'Expired' | 'Validation';

type FusionAuthDeviceType =
  | 'BROWSER'
  | 'DESKTOP'
  | 'LAPTOP'
  | 'MOBILE'
  | 'OTHER'
  | 'SERVER'
  | 'TABLET'
  | 'TV'
  | 'UNKNOWN';
