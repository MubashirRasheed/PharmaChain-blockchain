import OrderModel from "../Models/OrderModel.js";

// Crud Operations
export const GetOrder = async (req, res, next) => {
  try {
    OrderModel.find({ _id: req.params.id }).exec(function (error, data) {
      if (error) {
        return next(error);
      }
      res.json(data);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const GetAllOrders = async (req, res, next) => {
  console.log(req.body);
  OrderModel.find({}).exec(function (error, data) {
    if (error) {
      return next(error);
    }
    res.json(data);
  });
};

export const AddNewOrder = async (req, res, next) => {
  try {
    console.log("Got a request for creating a new Order");
    console.log(req.body);

    OrderModel.create(req.body)
      .then(function (data) {
        console.log(data);
        res.status(200);
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.send(err.message);
      });
  } catch (error) {
    console.log("Error encountered: ", error.message);
    next(error);
  }
};

export const UpdateOrder = async (req, res, next) => {
  await OrderModel.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    quantity: req.body.quantity,
    inStock: req.body.inStock,
    description: req.body.description,
  });
  let newOrder = await OrderModel.findById(req.params.id);
  res.json(newOrder);
};

export const DeleteOrder = async (req, res, next) => {
  OrderModel.deleteOne({ _id: req.params.id }).exec(function (error, data) {
    if (error) {
      next(error);
    }
    res.json(data);
  });
};

export default {
  AddNewOrder,
  UpdateOrder,
  GetOrder,
  GetAllOrders,
  DeleteOrder,
};