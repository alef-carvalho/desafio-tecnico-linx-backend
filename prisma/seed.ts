import { PrismaClient } from '@prisma/client';
import { petSeeder } from './seeders/pet.seeder';
import { userSeeder } from './seeders/user.seeder';
import { vacineSeeder } from './seeders/vaccine.seeder';

const prisma = new PrismaClient({
    log: ['query'],
});

async function main() {
    await Promise.all([userSeeder.run(prisma), vacineSeeder.run(prisma), petSeeder.run(prisma)]);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
