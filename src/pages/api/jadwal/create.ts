import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';
export default async function handler(req: NextApiRequest, res:NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
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

      const {
        keretaId,
        waktuBerangkat,
        waktuTiba,
        stasiunBerangkat,
        stasiunTiba,
        asalKeberangkatan,
        tujuanKeberangkatan,
        tanggalBerangkat,
        tanggalKedatangan,
        harga,
        kuota,
      } = req.body;
    const jadwal = await prisma.jadwal.create({
      data: {
        keretaId,
        waktuBerangkat,
        waktuTiba,
        stasiunBerangkat,
        stasiunTiba,
        asalKeberangkatan,
        tujuanKeberangkatan,
        tanggalBerangkat: new Date(tanggalBerangkat),
        tanggalKedatangan: new Date(tanggalKedatangan),
        harga,
        kuota,
      },
    });
    res.status(201).json(jadwal);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
}
