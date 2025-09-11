import sharedRoutes from 'shared/routes/routes';
import authRoutes from 'auth/routes/routes';
import auditRoutes from '../modules/audits/routes/routes';
import vulnerabilityRoutes from 'vulnerability/routes/routes';
import adminRoutes from '../modules/admin/routes/routes';

export default [
  ...vulnerabilityRoutes,
  ...authRoutes,
  ...sharedRoutes,
  ...auditRoutes,
  ...adminRoutes
];
