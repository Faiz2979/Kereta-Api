import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const jadwal = await prisma.jadwal.findUnique({
      where: { id: Number(id) },
      include: {
        kereta: true,
      },
    });

    if (!jadwal) {
      return res.status(404).json({ message: 'Jadwal not found' });
    }

    return res.status(200).json(jadwal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}