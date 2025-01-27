import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const kereta1 = await prisma.kereta.create({
    data: {
      namaKereta: 'Kereta 1',
      deskripsi: 'Deskripsi Kereta 1',
      kelas: 'Eksekutif'
    }
  });

  const kereta2 = await prisma.kereta.create({
    data: {
      namaKereta: 'Kereta 2',
      deskripsi: 'Deskripsi Kereta 2',
      kelas: 'Bisnis'
    }
  });

  const jadwal1 = await prisma.jadwal.create({
    data: {
      keretaId: kereta1.id,
      waktuBerangkat: '08:00',
      waktuTiba: '12:00',
      stasiunBerangkat: 'Stasiun A',
      stasiunTiba: 'Stasiun B',
      asalKeberangkatan: 'Kota A',
      tujuanKeberangkatan: 'Kota B',
      tanggalBerangkat: new Date('2025-01-01'),
      tanggalKedatangan: new Date('2025-01-01T12:00:00'),
      harga: 100000.0
    }
  });

  const jadwal2 = await prisma.jadwal.create({
    data: {
      keretaId: kereta2.id,
      waktuBerangkat: '09:00',
      waktuTiba: '13:00',
      stasiunBerangkat: 'Stasiun C',
      stasiunTiba: 'Stasiun D',
      asalKeberangkatan: 'Kota B',
      tujuanKeberangkatan: 'Kota C',
      tanggalBerangkat: new Date('2025-01-02'),
      tanggalKedatangan: new Date('2025-01-02T13:00:00'),
      harga: 120000.0
    }
  });

  const gerbong1 = await prisma.gerbong.create({
    data: {
      nama: 'Gerbong 1',
      kuota: 50,
      keretaId: kereta1.id
    }
  });

  const kursi1 = await prisma.kursi.create({
    data: {
      noKursi: 'A1',
      gerbongId: gerbong1.id
    }
  });

  const user1 = await prisma.users.create({
    data: {
      username: 'samud1',
      password: 'password1',
      email: 'awokawk@ojdwoei;.com',
      role: 'pelanggan'
    }
  });

  const pelanggan1 = await prisma.pelanggan.create({
    data: {
      nik: '54635165612',
      nama: 'Pelanggan 1',
      userId: user1.id
    }
  });

  const pembelianTiket1 = await prisma.pembelianTiket.create({
    data: {
      tanggal: new Date(),
      pelangganId: pelanggan1.id,
      jadwalId: jadwal1.id
    }
  });

  await prisma.detailPembelian.create({
    data: {
      nik: '54635165612',
      namaPenumpang: 'Penumpang 1',
      pembelianTiketId: pembelianTiket1.id,
      kursiId: kursi1.id
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