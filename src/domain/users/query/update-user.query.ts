import { IsUserId } from '../validators/is-user-id.validator';
import { Type } from 'class-transformer';

export class UpdateUserQuery {
    @Type(() => Number)
    @IsUserId()
    userId: number;
}
