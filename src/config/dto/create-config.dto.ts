import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";

class ConfigValue {
    @IsNotEmpty()
    @IsBoolean()
    qa: boolean;
}
export class CreateConfigDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ConfigValue)
    value: ConfigValue
}
