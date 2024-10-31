import { IsPetId } from '../validators/is-pet-id.validator';
import { Type } from 'class-transformer';

export class UpdatePetQuery {
    @Type(() => Number)
    @IsPetId()
    petId: number;
}
