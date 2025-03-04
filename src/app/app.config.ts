import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { MAIN_ROUTES } from './routes';
// import { environment } from '@env/environment';

import { EcfrAdminService } from '@app/services/api/ecfr-admin/ecfr-admin.service';
import { ECFR_ADMIN_SERVICE_TOKEN } from '@app/services/tokens/ecfr-admin.token';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ECFR_ADMIN_SERVICE_TOKEN,
      useClass: EcfrAdminService,
    },
    provideRouter([
      ...MAIN_ROUTES,
      // ...EXCEPTION_ROUTES,  // Uncomment if needed
    ]),
  ]
};
