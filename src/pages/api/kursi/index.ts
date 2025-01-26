// read data kereta

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    console.log("req.method", req.method);
    if (req.method === "GET") {
        try {
        const kursi = await prisma.kursi.findMany();

        return res.status(200).json({ kursi });
        } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "An unknown error occurred" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}