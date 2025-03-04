import { ICFRReference } from "@app/models/common/cfr-reference.model";

export interface IAgency {
    name: string;
    shortName: string;
    displayName: string;
    sortableName: string;
    slug: string;
    children: IAgency[];
    ecfrReferences: ICFRReference[];
}