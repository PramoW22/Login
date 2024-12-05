const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logAction = require('../utils/logAction');

const bcrypt = require('bcrypt');

export class AuthController {
  static PEPPER = process.env.PASSWORD_PEPPER;
  static JWT_SECRET = process.env.JWT_SECRET;
  static SALT_ROUNDS = 12;
  static TRANSIT_KEY = process.env.TRANSIT_KEY;

  static decryptTransitPassword(transitPassword) {
    const bytes = CryptoJS.AES.decrypt(
      transitPassword,
      AuthController.TRANSIT_KEY
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static applyPepper(password) {
    return crypto
      .createHmac("sha256", AuthController.PEPPER)
      .update(password)
      .digest("hex");
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
        salt
      });

      // Send verification email
      await AuthController.sendVerificationEmail(user.email, verificationToken);

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
