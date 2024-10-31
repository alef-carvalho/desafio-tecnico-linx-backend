import { IsPetId } from '../validators/is-pet-id.validator';
import { Type } from 'class-transformer';

export class DeletePetQuery {
    @Type(() => Number)
    @IsPetId()
    petId: number;
}
