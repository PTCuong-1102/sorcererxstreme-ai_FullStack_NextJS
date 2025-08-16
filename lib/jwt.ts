import { verify, sign } from 'jsonwebtoken';

export function verifyJWT(token: string): Promise<{ userId: string }> {
  return new Promise((resolve, reject) => {
    verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded as { userId: string });
    });
  });
}

export function signJWT(payload: { userId: string }): string {
  return sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}
