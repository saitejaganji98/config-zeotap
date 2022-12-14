import { IsNotEmpty, IsString } from "class-validator";

export class CreateFeatureDto {
    @IsNotEmpty()
    @IsString()
    featureKey: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}