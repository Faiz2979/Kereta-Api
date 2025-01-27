import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.users.create({
    data: {
      username: 'user1',
      password: hashedPassword,
      email: 'user1@gmail.com', // Email unik
      role: 'admin',
      petugas: {
        create: {
          nama: 'Admin User',
          alamat: 'Admin Address',
          telp: '1234567890'
        }
      }
    }
  });

  await prisma.users.create({
    data: {
      username: 'user2',
      password: hashedPassword,
      email: 'user2@gmail.com', // Email unik
      role: 'pelanggan',
      pelanggan: {
        create: {
          nik: '1234567890123456',
          nama: 'Pelanggan User',
          alamat: 'Pelanggan Address',
          telp: '0987654321',
        },
      },
    }
  });

  await prisma.kereta.create({
    data: {
      namaKereta: 'Kereta 1',
      deskripsi: 'Deskripsi Kereta 1',
      kelas: 'Eksekutif'
    }
  });

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });