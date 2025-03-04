import { InjectionToken } from '@angular/core';
import { IEcfrAdminService } from '@app/services/api/ecfr-admin/ecfr-admin.service.interface';

export const ECFR_ADMIN_SERVICE_TOKEN = new InjectionToken<IEcfrAdminService>('IEcfrAdminService');
