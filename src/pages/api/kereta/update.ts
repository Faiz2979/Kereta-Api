// update data kereta

import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';
export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if (req.method === "PUT") {
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
        const { id } = req.query;
        const { namaKereta, deskripsi, kelas } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }
        const updateData: { namaKereta?: string; deskripsi?: string; kelas?: string } = {};

        if (namaKereta) {
            updateData.namaKereta = namaKereta;
        }
        if (deskripsi) {
            updateData.deskripsi = deskripsi;
        }
        if (kelas) {
            updateData.kelas = kelas;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "At least one field (namaKereta, deskripsi, kelas) is required to update" });
        }

        const kereta = await prisma.kereta.update({
            where: {
                id: Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10),
            },
            data: {
                ...updateData,
            },
        });

        return res.status(201).json({ kereta });
        } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "An unknown error occurred" });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}