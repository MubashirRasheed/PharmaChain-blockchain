import express from 'express';
// import {bidPost, bidAccept } from '../controllers/bidController.js'
import {conPost, conGet, makePayment, updateContract, retrieveReceipt} from '../controllers/contract.js'
import authMiddleware from '../middlewares/AuthMiddleware.js';

const conRouter = express.Router();

conRouter.post('/post',authMiddleware ,conPost)
conRouter.get('/getContract',authMiddleware, conGet)
conRouter.post('/payment/:contractId', makePayment)
conRouter.put('/update',authMiddleware, updateContract)
conRouter.post('/receipt/:paymentId', retrieveReceipt)
// jobPostRouter.get('/get/:jobId',authMiddleware, jobGet)
// bidRouter.get('/get',authMiddleware, jobGet)

export default conRouter;