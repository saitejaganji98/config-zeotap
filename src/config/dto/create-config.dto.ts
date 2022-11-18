import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateConfig, EnvValue, Value } from './../entities/config.entity';

export class AllConfigValue implements EnvValue {
    @IsNotEmpty()
    qa: Value;
    @IsNotEmpty()
    @IsOptional()
    test: Value;
    @IsNotEmpty()
    @IsOptional()
    stage: Value;
    @IsNotEmpty()
    @IsOptional()
    prod: Value;
    @IsNotEmpty()
    @IsOptional()
    demo: Value;
    @IsNotEmpty()
    @IsOptional()
    'demo-qa': Value;
    @IsNotEmpty()
    @IsOptional()
    'ireland-stage': Value;
    @IsNotEmpty()
    @IsOptional()
    'okta-qa': Value;
    @IsNotEmpty()
    @IsOptional()
    ireland: Value;
}
export class CreateConfigDto implements Omit<CreateConfig, "createdOn" | "createdBy">{
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AllConfigValue)
    value: AllConfigValue
}
