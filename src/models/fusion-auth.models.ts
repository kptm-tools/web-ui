import { AxiosHeaders } from 'axios';

export interface FusionAuthLoginBody {
  applicationId: string;
  ipAddress?: string;
  loginId: string;
  metaData?: FusionAuthMetaData;
  noJWT?: boolean;
  password: string;
  twoFactorTrustId?: string;
}

export type FusionAuthLoginResponse =
  | SuccessAuthLoginUser
  | SuccessAuthLoginChangePassword
  | ErrorAuthLoginPrevent;

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

interface ErrorAuthLoginPrevent {
  actions: FusionAuthAction[];
}

interface SuccessAuthLoginChangePassword {
  changePasswordId: string;
  changePasswordReason: ChangePasswordReason;
}

interface SuccessAuthLoginUser {
  active: boolean;
  birthDate: string;
  connectorId: string;
  data: Record<string, unknown>;
  email: string;
  firstName: string;
  id: string;
  insertInstant: number;
  lastLoginInstant: number;
  lastName: string;
  lastUpdateInstant: number;
  memberships: Record<string, unknown>[];
  passwordChangeRequired: boolean;
  passwordLastUpdateInstant: number;
  preferredLanguages: string[];
  registrations: Registration[];
  tenantId: string;
  twoFactor: TwoFactor;
  usernameStatus: string;
  verified: boolean;
  verifiedInstant: number;
}

interface Registration {
  applicationId: string;
  data: Record<string, unknown>;
  id: string;
  insertInstant: number;
  lastLoginInstant: number;
  lastUpdateInstant: number;
  preferredLanguages: string[];
  roles: string[];
  tokens: Record<string, unknown>;
  usernameStatus: string;
  verified: boolean;
  verifiedInstant: number;
}

interface TwoFactor {
  methods: Record<string, unknown>[];
  recoveryCodes: string[];
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

type ChangePasswordReason =
  | 'Administrative'
  | 'Breached'
  | 'Expired'
  | 'Validation';

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
