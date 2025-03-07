import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { MAIN_ROUTES } from './routes';
// import { environment } from '@env/environment';

import { EcfrAdminService } from '@app/services/api/ecfr-admin/ecfr-admin.service';
import { ECFR_ADMIN_SERVICE_TOKEN } from '@app/services/tokens/ecfr-admin.token';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { EcfrWordCountService } from '@app/services/api/ecfr-wordcount/ecfr-wordcount.service';
import { ECFR_WORDCOUNT_SERVICE_TOKEN } from './services/tokens/ecfr-wordcount.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    {
      provide: ECFR_ADMIN_SERVICE_TOKEN,
      useClass: EcfrAdminService,
    },
    {
      provide: ECFR_WORDCOUNT_SERVICE_TOKEN,
      useClass: EcfrWordCountService,
    },
    provideRouter([
      ...MAIN_ROUTES,
      // ...EXCEPTION_ROUTES,  // Uncomment if needed
    ]),
  ]
};
