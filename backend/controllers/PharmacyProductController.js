import PharmacyProduct from "../models/PharmacyProductModel.js";

// Async function to get a PharmacyProduct by its PharmacyProductID
export const GetPharmacyProduct = async (req, res, next) => {
    try {
        PharmacyProduct.find({ PharmacyProductID: req.params.id }).exec(function (error, data) {
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

// Async function to get all PharmacyProducts
export const GetAllPharmacyProducts = async (req, res, next) => {
    try {
        const products = await PharmacyProduct.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Async function to add a new PharmacyProduct
export const AddNewPharmacyProduct = async (req, res) => {
    try {
        const newPharmacyProduct = new PharmacyProduct({

            id: req.body.id,
            sku: req.body.sku,
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            offerEnd: req.body.offerEnd,
            new: req.body.new,
            rating: req.body.rating,
            saleCount: req.body.saleCount,
            stock: req.body.stock,
            category: req.body.category,
            tag: req.body.tag,
            image: req.body.image,
            shortDescription: req.body.shortDescription,
            fullDescription: req.body.fullDescription,

        });

        const savedPharmacyProduct = await newPharmacyProduct.save(); // Save the new PharmacyProduct to the database

        res.status(201).json(savedPharmacyProduct); // Return the saved PharmacyProduct as a response
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle any errors that occur
    }
};

// Async function to update a PharmacyProduct by its PharmacyProductID
export const UpdatePharmacyProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // const { PharmacyProductID, CustomerName, TotalAmount, OrderItems, Location, Status, StatusBg, ProductImageUrl } = req.body;

        const pharmacyProduct = await PharmacyProduct.findOneAndUpdate({id: id}, {
            id: req.body.id,
            sku: req.body.sku,
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            offerEnd: req.body.offerEnd,
            new: req.body.new,
            rating: req.body.rating,
            saleCount: req.body.saleCount,
            stock: req.body.stock,
            category: req.body.category,
            tag: req.body.tag,
            image: req.body.image,
            shortDescription: req.body.shortDescription,
            fullDescription: req.body.fullDescription,
        }, { new: true });

        if (!pharmacyProduct) {
            return res.status(404).send({ message: "PharmacyProduct not found" });
        }

        res.status(200).send({ pharmacyProduct });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

// Async function to delete a pharmacyProduct by its PharmacyProductID
export const DeletePharmacyProduct = async (req, res) => {
    try {
        const { PharmacyProductID } = req.params;
        const deletedPharmacyProduct = await PharmacyProduct.findOneAndDelete({ PharmacyProductID });
        if (!deletedPharmacyProduct) {
            return res.status(404).send({ message: 'PharmacyProduct not found' });
        }
        return res.status(200).send({ message: 'PharmacyProduct deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};
