import { Host, Rapporteur } from 'src/models/hosts.models';
import { HostService } from 'src/services/host.service';
import { useHosthStore } from 'src/stores/host-store';

export function formatHostForTable(hosts: Host[]): Host[] {
  return hosts.map(host => ({
    ...host,
    hostName: host.name,
    creationDate: host.created_at,
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

export async function setInitalDataToStore(): Promise<void> {
  const store = useHosthStore();
  await store.setInitialList(await getInitalDataForHostTable());
}

export function getPrincipalRapporteur(rapporteurs: Rapporteur[]): string {
  return rapporteurs.find(({ is_principal }) => is_principal)?.email || '';
}

export async function deleteHostById(hostId: string): Promise<void> {
  try {
    await HostService.deleteHostById(hostId);
    await setInitalDataToStore();
  } catch (e) {
    console.log(e);
  }
}
