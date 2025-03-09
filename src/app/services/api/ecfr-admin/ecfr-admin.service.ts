import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';

import { IEcfrAdminService } from './ecfr-admin.service.interface';
import { environment } from '@env/environment';
import { GetAgencyResponse } from '@app/models/responses/get-agency-response';
import { GetCFRReferencesResponse } from '@app/models/responses/get-record-type-response.model';
import { GetLatestDateResponse } from '@app/models/responses/get-latest-date.model';

@Injectable({
    providedIn: 'root',
    useFactory: () => provideHttpClient(withFetch()),

})
export class EcfrAdminService implements IEcfrAdminService {
    apiUrl = `${environment.apiEndpoint}/admin`;

    constructor(private _http: HttpClient) {}
    
    getAllAgencies(): Observable<GetAgencyResponse> {
        return this._http.get<GetAgencyResponse>(`${this.apiUrl}/agencies`).pipe(
            catchError(error => {
                throw error;
            })
        );
    }

    getCFRReferencesByShortName(agencyShortName: string): Observable<GetCFRReferencesResponse[]> {
        return this._http.get<GetCFRReferencesResponse[]>(`${this.apiUrl}/agencies/get-cfr-references/${agencyShortName}`).pipe(
            catchError(error => {
                throw error;
            })
        );
    }

    getLatestECFRDataDate():Observable<GetLatestDateResponse>{
        return this._http.get<GetLatestDateResponse>(`${this.apiUrl}/latest-date`).pipe(
            catchError(error => {
                throw error;
            })
        );
    }
}
