import { PickType } from '@nestjs/swagger';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends PickType(CreateUserDTO, ['name', 'email'] as const) {}
