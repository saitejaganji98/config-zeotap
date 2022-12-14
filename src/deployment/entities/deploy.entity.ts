
export class Deploy {
    features: Features;
    deployedBy: string;
    deployedAt: number;
    env: string;
}

export type Features = {
    [key:string]: {
                    enabled: boolean;
                    config: object;
                }
};

export interface ArtifactResponse {
    features: Features;
    env: string;
}