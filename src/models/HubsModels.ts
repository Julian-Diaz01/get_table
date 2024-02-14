export enum GroupByEnum {
    NONE = 'NONE',
    STAGE = 'STAGE',
    STATE = 'STATE'
}

export enum HubStageEnum {
    PILOT = 'PILOT',
    FULLY_ONBOARDED = 'FULLY_ONBOARDED',
}

export interface HubData {
    recoveredQuantity?: number;
    totalRecoveredQuantity?: number;
    unassignedQuantityTotal?: number;
    stage?: string;
    state?: string;
    type?: string;
    displayName?: string;
    location?: string;
    logo?: {
        directLink?: string;
    };
}