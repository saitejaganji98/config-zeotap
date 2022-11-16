import { UpdateConfig } from './../entities/config.entity';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { AllConfigValue, CreateConfigDto } from './create-config.dto';
import { Type } from 'class-transformer';

export class UpdateConfigDto implements Omit<UpdateConfig, "updatedOn" | "updatedBy"> {
    @IsNotEmpty()
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AllConfigValue)
    value: AllConfigValue
}
