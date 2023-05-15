import express from 'express';
// import {bidPost, bidAccept } from '../Controllers/bidController.js'
import {conPost, conGet} from '../Controllers/contract.js'
import authMiddleware from '../Middlewares/AuthMiddleware.js';

const conRouter = express.Router();

conRouter.post('/post',authMiddleware ,conPost)
conRouter.get('/getContract',authMiddleware, conGet)
// jobPostRouter.get('/get/:jobId',authMiddleware, jobGet)
// bidRouter.get('/get',authMiddleware, jobGet)

export default conRouter;