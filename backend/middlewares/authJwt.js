const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.SUser;

// Verify Token
const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    try {
      const decoded = jwt.verify(token, config.secret);
      req.userId = decoded.id;
      next();
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
  };
  
  // ตรวจสอบว่าผู้ใช้เป็นผู้ดูแลระบบหรือไม่
  const isAdmin = async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId);
      if (!user) return res.status(404).send({ message: "User not found" });
  
      const roles = await user.getRoles();
      const isAdminRole = roles.some((role) => role.name === "admin");
  
      if (isAdminRole) {
        next();
      } else {
        return res.status(403).send({ message: "Unauthorized access, Require Admin Role!" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };


  // Export
const authJwt = {
    verifyToken,
    isAdmin,
  };
  
  module.exports = authJwt;