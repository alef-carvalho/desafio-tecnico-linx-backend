import { PrismaClient } from '@prisma/client';

type VaccineData = {
    id: number;
    name: string;
    description?: string;
};

const vaccines: VaccineData[] = [
    { id: 1, name: 'Gripe canina' },
    { id: 2, name: 'Giárdia' },
    { id: 3, name: 'Raiva canina' },
];

async function run(prisma: PrismaClient) {
    for (const vaccine of vaccines) {
        await prisma.vaccine.upsert({
            create: vaccine,
            update: vaccine,
            where: { id: vaccine.id },
        });
    }
}

export const vacineSeeder = { run };
