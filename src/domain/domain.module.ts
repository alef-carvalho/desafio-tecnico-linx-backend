import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PetModule } from './pets/pet.module';
import { UserModule } from './users/user.module';

@Module({
    imports: [AuthModule, PetModule, UserModule],
})
export class DomainModule {}
