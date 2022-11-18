import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UpdateConfig, Value } from './../entities/config.entity';
import { AllConfigValue } from './create-config.dto';

export class UpdateConfigValue extends AllConfigValue {
    @IsNotEmpty()
    @IsOptional()
    qa: Value;
}
export class UpdateConfigDto implements Omit<UpdateConfig, "updatedOn" | "updatedBy"> {
    @IsNotEmpty()
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @ValidateNested()
    @IsOptional()
    @Type(() => UpdateConfigValue)
    value: UpdateConfigValue
}
