import { db } from '../config/db.js';
import { codes } from './schema.js';
import { eq } from 'drizzle-orm';

export const saveCode = async (data) => {
  await db.insert(codes).values(data);
};

export const findCode = async (code) => {
  const result = await db.select().from(codes).where(eq(codes.code, code));
  return result[0];
};

export const deleteCode = async (code) => {
  await db.delete(codes).where(eq(codes.code, code));
};
