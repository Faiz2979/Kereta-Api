import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function rekapHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

    if (!user || user.role !== 'petugas') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { bulan, tahun } = req.query;

    if (!bulan || !tahun) {
      return res.status(400).json({ message: 'Bulan dan tahun harus disertakan' });
    }

    const startDate = new Date(`${tahun}-${bulan}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const pemasukan = await prisma.pembelianTiket.aggregate({
      _sum: {
        harga: true,
      },
      where: {
        tanggal: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    return res.status(200).json({
      bulan: format(startDate, 'MMMM yyyy'),
      totalPemasukan: pemasukan._sum.harga || 0,
    });
  } catch (error: any) {
    console.error('Error fetching rekap pemasukan:', error.message || error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
