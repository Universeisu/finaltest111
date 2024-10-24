const storecontrollers = require("../controllers/store.controllers");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authJwt").verifyToken;


// Route สำหรับ CRUD ร้านค้า
router.post("/", storecontrollers.create);
router.get("/", storecontrollers.getAll);
router.get("/:storeId",  storecontrollers.getById);
router.put("/:storeId",  storecontrollers.update);
router.delete("/:storeId",  storecontrollers.delete);

module.exports = router; // ตรวจสอบให้แน่ใจว่าส่งออกเป็น router
