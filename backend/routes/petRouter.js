const express = require("express");
const router = express.Router();
const {
  createPet,
  updatePet,
  deletePet,
  getPet,
  getPets,
  searchPets,
  getCustomerPets,
  getThreeCatsAndDogs,
} = require("../controllers/PetsController");
const errorHandler = require("../middleware/errorMiddelware");
const { isAdmin } = require("../middleware/authMiddleware");

router.post(
  "/",
  isAdmin,
  errorHandler(createPet)
);
router.get('/featured', errorHandler(getThreeCatsAndDogs));
router.get("/", errorHandler(getPets));
router.get("/customers/:id",errorHandler(getCustomerPets));
router.get("/:petId", errorHandler(getPet));
router.put("/:petId", isAdmin, errorHandler(updatePet));
router.delete("/:petId", isAdmin, errorHandler(deletePet));
router.post('/search', errorHandler(searchPets));

module.exports = router;
