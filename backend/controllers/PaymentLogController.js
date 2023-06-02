import PaymentLog from "../models/PaymentLogSchema.js"

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
export const AddNewPaymentLog = (req, res) => {
    const { TotalAmount, TotalProducts, QuantityByProduct } = req.body;
  
    const paymentLog = new PaymentLog({
      TotalAmount,
      TotalProducts,
      QuantityByProduct: Object.entries(QuantityByProduct).map(([name, quantity]) => ({
        name,
        quantity
      })),
    });
  
    paymentLog.save()
      .then(savedLog => {
        console.log('Payment log saved:', savedLog);
        res.status(200).json({ success: true, message: 'Payment log saved successfully' });
      })
      .catch(error => {
        console.error('Error saving payment log:', error);
        res.status(500).json({ success: false, message: 'Failed to save payment log' });
      });
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
