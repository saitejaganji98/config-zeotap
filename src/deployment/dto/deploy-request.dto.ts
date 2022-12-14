import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class DeployRequestDto {
    @IsNotEmpty()
    @IsString()
    featureKey: string;

    @IsNotEmpty()
    @IsString()
    env: string;

    @IsNotEmpty()
    @IsBoolean()
    enabled: boolean;

    @IsOptional()
    @IsObject()
    config: object;
}
