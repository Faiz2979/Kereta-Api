import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Dummy user data for demonstration purposes
const users = [
  {
    id: 1,
    username: 'user1',
    password: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Zf4QjLJ/2d7w5Z9p7QK5K' // hashed password for 'password123'
  }
];

const secretKey = 'your_secret_key';

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

  res.status(200).json({ token });
}