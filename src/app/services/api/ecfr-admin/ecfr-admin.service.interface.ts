// import { HealthRecordDetails } from "@app/models/health-record-details.model";
import { Observable } from "rxjs";
import { GetAgencyResponse } from "@app/models/responses/get-agency-response";
import { GetCFRReferencesResponse } from "@app/models/responses/get-record-type-response.model";

export interface IEcfrAdminService {
  
  getAllAgencies():Observable<GetAgencyResponse>;
  getCFRReferencesByShortName(agencyShortName: string):Observable<GetCFRReferencesResponse[]>;
}