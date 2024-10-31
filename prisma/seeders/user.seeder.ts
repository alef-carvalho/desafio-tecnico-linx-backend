import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

type UserData = {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
};

const users: UserData[] = [
    {
        id: 1,
        name: 'Administrador',
        email: 'admin@teste.com',
        phone: '11900000000',
        password: bcrypt.hashSync('12345678', 10),
        role: 'ADMIN',
    },
    {
        id: 2,
        name: 'Cliente',
        email: 'cliente@teste.com',
        phone: '11900000000',
        password: bcrypt.hashSync('12345678', 10),
        role: 'CLIENT',
    },
];

async function run(prisma: PrismaClient) {
    for (const user of users) {
        await prisma.user.upsert({
            create: user,
            update: user,
            where: { id: user.id },
        });
    }
    const count = await prisma.user.count();
    await prisma.$queryRawUnsafe(`ALTER SEQUENCE public.users_id_seq RESTART ${count}`);
}

export const userSeeder = { run };
