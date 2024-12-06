const User = require('../models/User');
const UserLog = require('../models/userLog'); // Import the UserLog model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const crypto = require("crypto");

class AuthController {
  static PEPPER = process.env.PASSWORD_PEPPER;
  static JWT_SECRET = process.env.JWT_SECRET;
  static SALT_ROUNDS = 12;
  static TRANSIT_KEY = process.env.TRANSIT_KEY;

  // Decrypt the transit-protected password
  static decryptTransitPassword(transitPassword) {
    const bytes = CryptoJS.AES.decrypt(
      transitPassword,
      AuthController.TRANSIT_KEY
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Apply a pepper to the password
  static applyPepper(password) {
    return crypto
      .createHmac("sha256", AuthController.PEPPER)
      .update(password)
      .digest("hex");
  }

  // Generate JWT Token
  static generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      AuthController.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }

  static async logUserAction(userId, action) {
    try {
      await UserLog.create({
        userId,
        action,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error logging user action:", error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password: transitPassword } = req.body;

      // Decrypt the transit-protected password
      const password = AuthController.decryptTransitPassword(transitPassword);

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(403).json({
          message: "Please verify your email before logging in",
          requiresVerification: true,
          email: user.email,
        });
      }

      // Combine password with pepper
      const pepperedPassword = AuthController.applyPepper(password);

      // Verify password using stored salt
      const isValid = await bcrypt.compare(pepperedPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = AuthController.generateToken(user);

      // Log user login action
      await AuthController.logUserAction(user._id, "User logged in");

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.username,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res
        .status(500)
        .json({ message: "Login failed", error: error.message });
    }
  }

  static async register(req, res) {
    try {
      const { email, password: transitPassword, username } = req.body;

      // Decrypt the transit-protected password
      const password = AuthController.decryptTransitPassword(transitPassword);

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate a unique salt for this user
      const salt = await bcrypt.genSalt(AuthController.SALT_ROUNDS);

      // Combine password with pepper
      const pepperedPassword = AuthController.applyPepper(password);

      // Hash the peppered password with the salt
      const hashedPassword = await bcrypt.hash(pepperedPassword, salt);

      // Create new user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        salt,
      });

      // Log user registration action
      await AuthController.logUserAction(user._id, "User registered");

      res.status(201).json({
        message:
          "Registration successful. Please check your email to verify your account.",
        requiresVerification: true,
        email: user.email,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    }
  }
}

module.exports = AuthController;
