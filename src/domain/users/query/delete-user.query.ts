import { IsUserId } from '../validators/is-user-id.validator';
import { Type } from 'class-transformer';

export class DeleteUserQuery {
    @Type(() => Number)
    @IsUserId()
    userId: number;
}
