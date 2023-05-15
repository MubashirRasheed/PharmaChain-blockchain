import express from 'express';
import {bidPost, bidAccept } from '../Controllers/bidController.js'
import authMiddleware from '../Middlewares/AuthMiddleware.js';

const bidRouter = express.Router();

bidRouter.post('/post',authMiddleware, bidPost)
bidRouter.post('/accept',authMiddleware, bidAccept)
// jobPostRouter.get('/get/:jobId',authMiddleware, jobGet)
// bidRouter.get('/get',authMiddleware, jobGet)

export default bidRouter;