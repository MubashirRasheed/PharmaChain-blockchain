import PaymentLog from "../Models/PaymentLogSchema.js"

// Async function to get a PaymentLog by its PaymentLogID
export const GetPaymentLog = async (req, res, next) => {
    try {
        PaymentLog.find({ PaymentLogID: req.params.id }).exec(function (error, data) {
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

// Async function to get all PaymentLogs
export const GetAllPaymentLogs = async (req, res, next) => {
    try {
        const products = await PaymentLog.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Async function to add a new PaymentLog
export const AddNewPaymentLog = async (req, res) => {
    try {
        const newPaymentLog = new PaymentLog({

            id: req.body.id,
            TotalAmount: req.body.TotalAmount,
            TotalProducts: req.body.TotalProducts,
            QuantityByProduct: req.body.QuantityByProduct,
        });

        const savedPaymentLog = await newPaymentLog.save(); // Save the new PaymentLog to the database

        res.status(201).json(savedPaymentLog); // Return the saved PaymentLog as a response
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle any errors that occur
    }
};

// Async function to update a PaymentLog by its PaymentLogID
export const UpdatePaymentLog = async (req, res) => {
    try {
        const { id } = req.params;
        // const { PaymentLogID, CustomerName, TotalAmount, OrderItems, Location, Status, StatusBg, ProductImageUrl } = req.body;

        const PaymentLog = await PaymentLog.findOneAndUpdate(id, {
            id: req.body.id,
            TotalAmount: req.body.TotalAmount,
            TotalProducts: req.body.TotalProducts,
            QuantityByProduct: req.body.QuantityByProduct,
        }, { new: true });

        if (!PaymentLog) {
            return res.status(404).send({ message: "PaymentLog not found" });
        }

        res.status(200).send({ PaymentLog });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

// Async function to delete a PaymentLog by its PaymentLogID
export const DeletePaymentLog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPaymentLog = await PaymentLog.findOneAndDelete({ id });
        if (!deletedPaymentLog) {
            return res.status(404).send({ message: 'PaymentLog not found' });
        }
        return res.status(200).send({ message: 'PaymentLog deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};
