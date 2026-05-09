import { db } from '../config/db.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';

class UserModel {
  async createUser(id, email, hashedPassword) {
    const result = await db.insert(users).values({
      id,
      email,
      password: hashedPassword
    }).returning();
    return result[0];
  }

  async findUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async findUserById(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
}

export default new UserModel();
