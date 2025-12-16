//Init Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//création user
async function main() {

    //delete user if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: 'test@test.com' }
    });
    if (existingUser) {
        await prisma.user.delete({
            where: { email: 'test@test.com' }
        })
    }

    //create new user
    const user = await prisma.user.create({
        data: {
            email: 'test@test.com',
            password: 'password123',
        },
    });
    console.log('user created: ', user);
}

main()
    .catch((error) => {
        console.error('Error: ', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });