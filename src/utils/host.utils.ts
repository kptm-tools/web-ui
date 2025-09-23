import type { Host, Rapporteur } from 'vulnerability/models/hosts';
import { HostService } from 'vulnerability/services/host';
import { useHostStore } from 'vulnerability/stores/host';
import { formatHostDate } from './date.utils';

export function formatHostForTable(hosts: Host[]): Host[] {
  return hosts.map(host => ({
    ...host,
    hostName: host.name,
    creationDate: formatHostDate(host.created_at),
    originalCreationDate: host.created_at,
    email: getPrincipalRapporteur(host.rapporteurs)
  })) as Host[];
}

export async function getHostFromService(): Promise<Host[]> {
  return (await HostService.getHosts()).data;
}

export async function getHostByIdFromService(hostId: string): Promise<Host> {
  return (await HostService.getHostById(hostId)).data;
}

export async function getInitalDataForHostTable(): Promise<Host[]> {
  return formatHostForTable((await HostService.getHosts()).data);
}

export async function setInitialDataToStore(): Promise<void> {
  const store = useHostStore();
  store.setInitialList(await getInitalDataForHostTable());
}

export function getPrincipalRapporteur(rapporteurs: Rapporteur[]): string {
  return rapporteurs.find(({ is_principal }) => is_principal)?.email || '';
}

export async function deleteHostById(hostId: string): Promise<void> {
  try {
    await HostService.deleteHostById(hostId);
    await setInitialDataToStore();
  } catch (e) {
    console.log(e);
  }
}

export function formatHostToRequestServiceBody(hosts: Host[]) {
  return hosts.map(h => ({
    name: h.alias || '',
    credentials: h.credentials,
    rapporteurs: h.rapporteurs,
    value: h.host || '',
    value_type: h.value_type || 'Domain'
  }));
}
