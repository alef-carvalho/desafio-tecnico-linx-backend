import { PetType, PrismaClient } from '@prisma/client';

type PetData = {
    id: number;
    user_id: number;
    name: string;
    birth_date: Date;
    type: PetType;
};

const pets: PetData[] = [
    {
        id: 1,
        user_id: 2,
        name: 'Amora',
        birth_date: new Date(2020, 1, 1),
        type: 'CAT',
    },
    {
        id: 2,
        user_id: 2,
        name: 'Urso',
        birth_date: new Date(2020, 1, 1),
        type: 'DOG',
    },
];

async function run(prisma: PrismaClient) {
    for (const pet of pets) {
        await prisma.pet.upsert({
            create: pet,
            update: pet,
            where: { id: pet.id },
        });
    }
    const count = await prisma.pet.count();
    await prisma.$queryRawUnsafe(`ALTER SEQUENCE public.pets_id_seq RESTART ${count}`);
}

export const petSeeder = { run };
