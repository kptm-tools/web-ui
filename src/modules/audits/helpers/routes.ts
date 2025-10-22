import { useRouter } from 'vue-router';
import { AUDITS_ROUTES } from '../routes/route-names';

export async function goToScopeFormPage(id: string): Promise<void> {
  const router = useRouter();
  await router.push({
    name: AUDITS_ROUTES.auditScopeForm.name,
    params: { id }
  });
}
