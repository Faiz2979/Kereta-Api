import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function pesanTiketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, secretKey);
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== 'pelanggan') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { jadwalId, penumpang } = req.body;

    if (!jadwalId || !penumpang || !Array.isArray(penumpang) || penumpang.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const jadwal = await prisma.jadwal.findUnique({
      where: { id: jadwalId },
    });

    if (!jadwal) {
      return res.status(404).json({ message: 'Jadwal not found' });
    }

    const totalPenumpang = penumpang.length;

    // Remove kuota check
    // if (totalPenumpang > jadwal.kuota) {
    //   console.log(`Total Penumpang: ${totalPenumpang}, Kuota: ${jadwal.kuota}`);
    //   return res.status(400).json({ message: 'Kuota tidak mencukupi' });
    // }

    const pelanggan = await prisma.pelanggan.findFirst({
      where: { userId: user.id },
    });

    if (!pelanggan) {
      return res.status(404).json({ message: 'Pelanggan not found' });
    }

    const pembelianTiket = await prisma.pembelianTiket.create({
      data: {
        tanggal: new Date(),
        pelangganId: pelanggan.id,
        jadwalId: jadwal.id,
        penumpang: {
          create: penumpang.map((p: any) => ({
            nama: p.nama,
            nik: p.nik,
          })),
        },
      },
    });

    return res.status(201).json(pembelianTiket);
  } catch (error) {
    console.error('Error processing ticket purchase:', error instanceof Error ? error.message : error);
    if ((error as any).name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}