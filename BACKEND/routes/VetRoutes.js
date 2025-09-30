import express from 'express';
import {
  createVetController,
  getAllVetsController,
  getVetsAvailability,
  getVetByIdController,
  deleteVetController,
  updateAvailability,
} from '../controller/VetController.js';

const vetRouter = express.Router();

vetRouter.post('/', createVetController);
vetRouter.get('/', getAllVetsController);
vetRouter.get('/availability', getVetsAvailability);
vetRouter.post("/availability", updateAvailability);
vetRouter.get('/:vetId', getVetByIdController);
vetRouter.delete('/:vetId', deleteVetController);

export default vetRouter;
