import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // 1. Validasi kereta
    const kereta = await prisma.kereta.findUnique({
      where: { id: keretaId },
    });

    if (!kereta) {
      return res.status(404).json({ message: 'Kereta not found' });
    }

    // 2. Hitung total kuota dari semua gerbong kereta
    const totalKuotaGerbong = await prisma.gerbong.aggregate({
      where: { keretaId },
      _sum: {
        kuota: true,
      },
    });

    const kuotaLimit = totalKuotaGerbong._sum.kuota || 0; // Jika tidak ada gerbong, kuota 0

    if (kuotaLimit === 0) {
      return res.status(400).json({ message: 'Kereta has no gerbong or all gerbong have zero kuota' });
    }

    // 3. Validasi kuota jadwal yang diinput
    if (kuota > kuotaLimit) {
      return res.status(400).json({ message: `Kuota exceeds the limit of ${kuotaLimit}` });
    }

    if (kuota < 1) {
      return res.status(400).json({ message: 'Kuota must be at least 1' });
    }

    // 4. Buat jadwal baru
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

    return res.status(201).json({ message: 'Jadwal created successfully', jadwal });
  } catch (error: any) {
    console.error('Error creating jadwal:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
