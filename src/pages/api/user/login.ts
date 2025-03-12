import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, {
      expiresIn: '1h',
    });

    let welcomeMessage = `Selamat datang, ${user.username}! Anda masuk sebagai ${user.role}.`;

    if (user.role === 'pelanggan') {
      const pelanggan = await prisma.pelanggan.findUnique({
      where: { id: user.id },
      });
      if (pelanggan) {
      welcomeMessage = `Selamat datang, ${pelanggan.nama}! Anda masuk sebagai ${user.role}.`;
      }
    } else if (user.role === 'petugas') {
      const petugas = await prisma.petugas.findUnique({
      where: { id: user.id },
      });
      if (petugas) {
      welcomeMessage = `Selamat datang, ${petugas.nama}! Anda masuk sebagai ${user.role}.`;
      }
    }

    return res.status(200).json({ token, message: welcomeMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}