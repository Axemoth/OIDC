import express from 'express';
import clientController from '../controllers/client.controller.js';

const router = express.Router();

router.get('/clients', clientController.getClients);
router.post('/clients', clientController.createClient);
router.delete('/clients/:clientId', clientController.deleteClient);
router.put('/clients/:clientId/secret', clientController.regenerateSecret);

export default router;
