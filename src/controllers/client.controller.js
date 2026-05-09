import clientModel from '../models/client.model.js';
import crypto from 'crypto';
import { verifyToken } from '../utils/jwt.js';

class ClientController {
  async createClient(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const userId = decoded.sub;
      
      const { name, redirectUri } = req.body;
      if (!name || !redirectUri) {
        return res.status(400).json({ error: 'Name and Redirect URI are required' });
      }

      const clientId = `client_${crypto.randomBytes(8).toString('hex')}`;
      const clientSecret = `secret_${crypto.randomBytes(16).toString('hex')}`;

      const client = await clientModel.createClient(userId, name, clientId, clientSecret, redirectUri);
      
      res.status(201).json(client);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create client' });
    }
  }

  async getClients(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const userId = decoded.sub;

      const clients = await clientModel.findClientsByUser(userId);
      res.json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  }

  async deleteClient(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const userId = decoded.sub;
      const { clientId } = req.params;

      await clientModel.deleteClient(clientId, userId);
      res.json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete client' });
    }
  }

  async regenerateSecret(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const userId = decoded.sub;
      const { clientId } = req.params;

      const newSecret = `secret_${crypto.randomBytes(16).toString('hex')}`;
      const client = await clientModel.updateClientSecret(clientId, userId, newSecret);
      
      res.json(client);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to regenerate secret' });
    }
  }
}

export default new ClientController();
