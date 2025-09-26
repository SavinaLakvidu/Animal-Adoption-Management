import express from  'express';

import{createVetController, getAllVetsController, deleteVetController, getVetsAvailability, getVetByIdController} from '../controller/VetController.js';

const vetRouter = express.Router();
vetRouter.post('/' ,createVetController);
vetRouter.get("/", getAllVetsController);
vetRouter.get("/:vetId", getVetByIdController);
vetRouter.get("/availability", getVetsAvailability);
vetRouter.delete("/:vetId", deleteVetController);


export default vetRouter;   