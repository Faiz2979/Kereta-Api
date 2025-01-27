import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function transaksiHandler(req: NextApiRequest, res: NextApiResponse) {
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

    const { tanggal, bulan, tahun } = req.query;

    if (!tanggal && !bulan && !tahun) {
      return res.status(400).json({ message: 'Tanggal, bulan, atau tahun harus disertakan' });
    }

    let whereClause: any = {};

    if (tanggal && bulan && tahun) {
      whereClause = {
        tanggal: {
          gte: new Date(`${tahun}-${bulan}-${tanggal}T00:00:00Z`),
          lt: new Date(`${tahun}-${bulan}-${Number(tanggal) + 1}T00:00:00Z`),
        },
      };
    } else if (bulan && tahun) {
      whereClause = {
        tanggal: {
          gte: new Date(`${tahun}-${bulan}-01T00:00:00Z`),
          lt: new Date(`${tahun}-${Number(bulan) + 1}-01T00:00:00Z`),
        },
      };
    } else if (tahun) {
      whereClause = {
        tanggal: {
          gte: new Date(`${tahun}-01-01T00:00:00Z`),
          lt: new Date(`${Number(tahun) + 1}-01-01T00:00:00Z`),
        },
      };
    }

    const transaksi = await prisma.pembelianTiket.findMany({
      where: whereClause,
      include: {
        pelanggan: true,
        jadwal: {
          include: {
            kereta: true,
          },
        },
        penumpang: true,
      },
    });

    // Format and simplify the response
    const formattedTransaksi = transaksi.map((transaksi) => ({
      id: transaksi.id,
      tanggal: format(new Date(transaksi.tanggal), 'yyyy-MM-dd'),
      pelanggan: {
        nama: transaksi.pelanggan.nama,
        email: transaksi.pelanggan.email,
      },
      jadwal: {
        kereta: transaksi.jadwal.kereta.nama,
        tanggalBerangkat: format(new Date(transaksi.jadwal.tanggalBerangkat), 'yyyy-MM-dd'),
        tanggalKedatangan: format(new Date(transaksi.jadwal.tanggalKedatangan), 'yyyy-MM-dd'),
      },
      penumpang: transaksi.penumpang.map((penumpang) => ({
        nama: penumpang.nama,
        umur: penumpang.umur,
      })),
    }));

    return res.status(200).json(formattedTransaksi);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}