import express from 'express';
import controller from '../controllers/Cost';
import { Schemas, Validation } from '../middleware/Validation';

const router = express.Router();

router.post('/create', Validation(Schemas.cost.create), controller.createCost);
router.get('/get/:costMonth', controller.readCost);
router.get('/get-detail/:costYear/:costMonth', controller.readCostDetail);
router.get('/get/', controller.readAll);
router.patch('/update/:costId', Validation(Schemas.cost.update), controller.updateCost);
router.delete('/delete/:costId', controller.deleteCost);

export = router;
