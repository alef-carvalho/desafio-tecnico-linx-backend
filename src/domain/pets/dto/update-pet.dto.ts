import { CreatePetDTO } from './create-pet.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdatePetDTO extends OmitType(CreatePetDTO, ['type'] as const) {}
