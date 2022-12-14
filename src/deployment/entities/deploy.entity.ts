import { DeployRequestDto } from "../dto/deploy-request.dto";

export class Deploy {
    data: Features;
    deployedBy: string;
    deployedAt: number;
    env: string;
}

export type Features = {[key:string]: Pick<DeployRequestDto, "enabled" | "config">};

export interface ArtifactResponse {
    msg: string;
    data: Features;
    env: string;
}