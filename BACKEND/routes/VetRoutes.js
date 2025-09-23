import express from  'express';

import{createVetController, getAllVetsController, deleteVetController, deleteVetByIdController, getVetByIdController} from '../controller/VetController.js';
import { getVetByIdService } from '../service/VetService.js';

const vetRouter = express.Router();
vetRouter.post('/' ,createVetController);
vetRouter.get("/", getAllVetsController);
vetRouter.get("/:vetId", getVetByIdController)
vetRouter.delete("/:vetId", deleteVetController);


export default vetRouter;   