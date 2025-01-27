import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function historyHandler(req: NextApiRequest, res: NextApiResponse) {
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

    if (!user || user.role !== 'pelanggan') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const pelanggan = await prisma.pelanggan.findFirst({
      where: { userId: user.id },
    });

    if (!pelanggan) {
      return res.status(404).json({ message: 'Pelanggan not found' });
    }

    const history = await prisma.pembelianTiket.findMany({
      where: { pelangganId: pelanggan.id },
      include: {
        jadwal: {
          include: {
            kereta: true,
          },
        },
        penumpang: true,
      },
    });

    return res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching ticket history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}