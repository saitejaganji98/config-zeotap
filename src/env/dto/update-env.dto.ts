import { PartialType } from '@nestjs/mapped-types';
import { CreateEnvDto } from './create-env.dto';

export class UpdateEnvDto extends PartialType(CreateEnvDto) {}
