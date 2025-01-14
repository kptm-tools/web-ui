export interface ValidatedHost {
  hostname: string;
  ip: string;
  alias: string;
}

export interface ValidateHostAuth extends ValidatedHost {
  username: string;
  password: string;
}

export interface Host {
  id?: string;
  domain?: string;
  name?: string;
  value?: string;
  value_type?: 'Domain' | 'IP';
  created_at?: string;
  creationDate?: string;
  hostName?: string;
  ip?: string;
  alias?: string;
  host?: string;
  credentials: Credential[];
  rapporteurs: Rapporteur[];
  picked?: boolean;
}

export interface HostCreateBody {
  name?: string;
  value?: string;
  value_type?: 'Domain' | 'IP';
  credentials: Credential[];
  rapporteurs: Rapporteur[];
}

export interface Credential {
  id?: string;
  host_id?: string;
  username: string;
  password: string;
}
export interface Rapporteur {
  name: string;
  email: string;
  is_principal: boolean;
}
