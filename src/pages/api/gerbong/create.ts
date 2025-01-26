// create data gerbong

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("req.method", req.method);
    if (req.method === "POST") {
        try {
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
