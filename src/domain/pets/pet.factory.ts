import { Prisma } from '@prisma/client';
import { AuthUser } from '@domain/auth/auth.interface';
import { Injectable } from '@nestjs/common';
import { CreatePetDTO } from './dto/create-pet.dto';
import { UpdatePetDTO } from './dto/update-pet.dto';

@Injectable()
export class PetFactory {
    forCreate({ name, birth_date, type }: CreatePetDTO, user: AuthUser): Prisma.PetUncheckedCreateInput {
        return {
            name: name,
            type: type,
            user_id: user.id,
            birth_date: birth_date,
        };
    }

    forUpdate({ name, birth_date }: UpdatePetDTO): Prisma.PetUncheckedUpdateInput {
        return {
            name,
            birth_date,
        };
    }
}
