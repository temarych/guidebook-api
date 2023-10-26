import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface IPayload {
  id: string;
}

export const createAccessToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '5min' });
};

export const verifyToken = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as IPayload;
  return payload.id;
};
