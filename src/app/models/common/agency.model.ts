import { ITitleChapter } from "./titlechapter.model";

export interface IAgency {
    name: string;
    shortName: string;
    displayName: string;
    sortableName: string;
    slug: string;
    children: IAgency[];
    titleChapters: ITitleChapter[];
}