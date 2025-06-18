import sharedRoutes from 'shared/routes/routes';
import authRoutes from 'auth/routes/routes';
import vulnerabilityRoutes from 'vulnerability/routes/routes';

export default [...vulnerabilityRoutes, ...authRoutes, ...sharedRoutes];
