import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ('ADMIN' | 'CLIENT' | 'ALL')[]) => SetMetadata('roles', roles);
