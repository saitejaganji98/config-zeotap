import { PickType } from '@nestjs/mapped-types';
import { CreateFeatureDto } from './create-feature.dto';

export class UpdateFeatureDto extends PickType(CreateFeatureDto, ["description"] as const) {}
