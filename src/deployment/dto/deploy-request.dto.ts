import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { Features } from "../entities/deploy.entity";

export class DeploymentRequestDto {
    @IsNotEmpty()
    @IsObject()
    features: Features;

    @IsNotEmpty()
    @IsString()
    env: string;
}
