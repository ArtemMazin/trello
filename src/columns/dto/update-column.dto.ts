import { PartialType } from '@nestjs/swagger';
import { CreateColumnDto } from '.';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {}
