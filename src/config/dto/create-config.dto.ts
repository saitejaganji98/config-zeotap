import { Value, EnvValue, CreateConfig } from './../entities/config.entity';
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";

export class AllConfigValue implements EnvValue {
    @IsNotEmpty()
    qa: Value;

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
    type: Value;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AllConfigValue)
    value: AllConfigValue
}
