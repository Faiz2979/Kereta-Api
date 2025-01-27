import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function editProfileHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  try {
    console.log('Token:', token); // Log token for debugging

    const decoded: any = jwt.verify(token, secretKey);
    console.log('Decoded:', decoded); // Log decoded token for debugging

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { nama, alamat, telp } = req.body;

    if (!nama && !alamat && !telp) {
      return res.status(400).json({ message: 'No data provided to update' });
    }

    const updatedUser = await prisma.users.update({
      where: { id: decoded.userId },
      data: {
        nama: nama || undefined,
        alamat: alamat || undefined,
        telp: telp || undefined,
        pelanggan: decoded.role === 'pelanggan' ? {
          update: {
            nama: nama || undefined,
            alamat: alamat || undefined,
            telp: telp || undefined,
          },
        } : undefined,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}