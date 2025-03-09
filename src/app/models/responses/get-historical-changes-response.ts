import { IDailyChangeDto } from "../common/daily-change.model";

export interface GetHistoricalChangesResponse {
    dailyChanges: IDailyChangeDto[];
    totalChanges: number;
}

