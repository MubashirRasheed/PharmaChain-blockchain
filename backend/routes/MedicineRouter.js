import express from "express";

import MedicineController from "../controllers/MedicineController.js";

let router = express.Router();

router.post("/addNewMedicine", MedicineController.AddNewMedicine);

router.get("/allMedicines", MedicineController.GetAllMedicines);

router.delete("/deteleMedicine/:id", MedicineController.DeleteMedicine);

router.put("/updateMedicine/:id", MedicineController.UpdateMedicine);

export default router;