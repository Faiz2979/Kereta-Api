// create data gerbong

import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";

const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
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

            const { namaGerbong: nama, kuota, keretaId } = req.body;

            if (!nama || !kuota || !keretaId) {
                return res.status(400).json({ message: "Nama, deskripsi, and kelas are required" });
            }

            const gerbong = await prisma.gerbong.create({
                data: {
                    nama,
                    kuota: parseInt(kuota),
                    kereta: {
                        connect: {
                            id: parseInt(keretaId),
                        },
                    },
                },
            });

            return res.status(201).json({ gerbong });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "An unknown error occurred" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
