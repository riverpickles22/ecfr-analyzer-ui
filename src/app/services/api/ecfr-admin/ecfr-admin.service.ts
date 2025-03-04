import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';

import { IEcfrAdminService } from './ecfr-admin.service.interface';
import { environment } from '@env/environment';
import { GetAgencyResponse } from '@app/models/responses/get_agency-response';
import { GetCFRReferencesResponse } from '@app/models/responses/get-record-type-response.model';

@Injectable({
    providedIn: 'root',
    useFactory: () => provideHttpClient(withFetch()),

})
export class EcfrAdminService implements IEcfrAdminService {
    apiUrl = `${environment.apiEndpoint}/ecfr/admin`;

    constructor(private http: HttpClient) {}
    
    getAllAgencies(): Observable<GetAgencyResponse> {
        return this.http.get<GetAgencyResponse>(`${this.apiUrl}/agencies`)
        .pipe(
            catchError(error => {
                console.error('Error fetching agencies:', error);
                throw error;
            })
        );
    }

    getCFRReferencesByShortName(agencyShortName: string): Observable<GetCFRReferencesResponse[]> {
        return this.http.get<GetCFRReferencesResponse[]>(`${this.apiUrl}/agencies/get-cfr-references/${agencyShortName}`)
        .pipe(
            catchError(error => {
                console.error('Error fetching CFR references:', error);
                throw error;
            })
        );
    }
}
