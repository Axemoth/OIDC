import { db } from '../config/db.js';
import { clients } from './schema.js';
import { eq } from 'drizzle-orm';

class ClientModel {
  async createClient(userId, name, clientId, clientSecret, redirectUri) {
    const result = await db.insert(clients).values({
      userId,
      name,
      clientId,
      clientSecret,
      redirectUri
    }).returning();
    return result[0];
  }

  async findClientsByUser(userId) {
    const result = await db.select().from(clients).where(eq(clients.userId, userId));
    return result;
  }

  async findClientById(clientId) {
    const result = await db.select().from(clients).where(eq(clients.clientId, clientId));
    return result[0];
  }

  async deleteClient(clientId, userId) {
    return await db.delete(clients).where(
      eq(clients.clientId, clientId),
      eq(clients.userId, userId)
    );
  }

  async updateClientSecret(clientId, userId, newSecret) {
    const result = await db.update(clients)
      .set({ clientSecret: newSecret })
      .where(
        eq(clients.clientId, clientId),
        eq(clients.userId, userId)
      )
      .returning();
    return result[0];
  }
}

export default new ClientModel();
