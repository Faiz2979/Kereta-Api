import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function profileHandler(req: NextApiRequest, res: NextApiResponse) {
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is an admin
    if (user.role !== 'petugas') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { userId, username } = req.query;

    let targetUser;

    if (userId) {
      targetUser = await prisma.users.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          username: true,
          nama: true,
          telp: true,
        },
      });
    } else if (username) {
      targetUser = await prisma.users.findFirst({
        where: { username: String(username) },
        select: {
          id: true,
          username: true,
          nama: true,
          telp: true,
        },
      });
    } else {
      // Fetch all users if no userId or username is provided
      targetUser = await prisma.users.findMany({
        select: {
          id: true,
          username: true,
          nama: true,
          telp: true,
        },
      });
    }

    if (!targetUser || (Array.isArray(targetUser) && targetUser.length === 0)) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(targetUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getProfileHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await prisma.users.findFirst({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}