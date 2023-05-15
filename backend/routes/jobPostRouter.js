import express from 'express';
import {jobPost , jobGet, getAllJobsManu, getAllJobsDist, getAllJobsPharma} from '../Controllers/jobPostController.js'
import authMiddleware from '../Middlewares/AuthMiddleware.js';

const jobPostRouter = express.Router();

jobPostRouter.post('/post',authMiddleware, jobPost)
// jobPostRouter.get('/get/:jobId',authMiddleware, jobGet)
jobPostRouter.get('/get',authMiddleware, jobGet)
jobPostRouter.get('/getManu',authMiddleware, getAllJobsManu)
jobPostRouter.get('/getDist',authMiddleware, getAllJobsDist)
jobPostRouter.get('/getPharma',authMiddleware, getAllJobsPharma)

export default jobPostRouter;