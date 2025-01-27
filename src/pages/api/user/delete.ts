import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function deleteUserHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is an admin
    if (user.role !== 'petugas') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { userId } = req.query; // Ensure this matches the query parameter in the URL

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const targetUser = await prisma.users.findUnique({
      where: { id: Number(userId) },
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.users.delete({
      where: { id: Number(userId) },
    });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}