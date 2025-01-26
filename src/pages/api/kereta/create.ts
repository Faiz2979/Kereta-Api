

// create data kereta

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    console.log("req.method", req.method);
    if (req.method === "POST") {
        try {
        const { namaKereta, deskripsi, kelas } = req.body;

        if (!namaKereta || !deskripsi || !kelas) {
            return res.status(400).json({ message: "Nama, jenis, kelas, and harga are required" });
        }

        const kereta = await prisma.kereta.create({
            data: {
            namaKereta,
            deskripsi,
            kelas,
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
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}