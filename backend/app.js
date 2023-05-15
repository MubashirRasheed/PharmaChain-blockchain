import cookieParser from 'cookie-parser';
// import createError from 'http-errors'

// var ProductRouter = require("./routes/ProductRouter");
// const { productsPerformance } = require("./data/dummy");
// import userRouter from './routes/UserRouter';
// import productRouter from './routes/ProductRouter';

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
// import { fileURLToPath } from 'url';
// import { register } from './controllers/auth.js';
import authRoutes from './routes/UserRouter.js';
import ProductRouter from './routes/ProductRouter.js';
import OrderRouter from './routes/OrderRouter.js';
import MedicineRouter from './routes/MedicineRouter.js';
import KanbanRouter from './routes/KanbanRouter.js';
import EmployeeRouter from './routes/EmployeeRouter.js';
import CustomerRouter from './routes/CustomerRouter.js';
import ContractsRouter from './routes/ContractsRouter.js';
import chatRoutes from './routes/chatRoutes.js';
import jobPostRouter from './routes/jobPostRouter.js';
import bidRouter from './routes/bidRouter.js';
import conRouter from './routes/contractroute.js';


// var app = express();

// CONFIGURATIONS / MIDDLEWARE
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port: ${PORT} and Database is connected`));
}).catch((error) => console.log(error.message));

// app.use("/user", UserRouter);
app.use("/product", ProductRouter);
app.use("/order", OrderRouter);
app.use("/medicine", MedicineRouter);
app.use("/kanban", KanbanRouter);
app.use("/employee", EmployeeRouter);
app.use("/customer", CustomerRouter);
app.use("/contracts", ContractsRouter);
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/job-post', jobPostRouter);
app.use('/bids', bidRouter);

app.use('/contract', conRouter)

app.get("/", (req, res, next) => {
  res.send("Connected to server");
});
console.log("Sucessfully Started Node App");

// error handler

// app.use(function (err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.all("/", (req, res, next) => {
  res.send("Not Found");
});
