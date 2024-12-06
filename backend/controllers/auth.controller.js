import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

/* Sign Up */
export const signup = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if required fields are provided
      if (!username || !email || !password) {
        return next(errorHandler(400, "All fields are required"));
      }
  
    
  
      // Validate username: alphanumeric, 3-20 characters
      const isValidUsername = /^[a-zA-Z0-9_]{3,20}$/.test(username);
      if (!isValidUsername) {
        return next(errorHandler(400, "Username must be 3-15 characters long and can only contain letters, numbers, underscores and hyphens."));
      }
  
      // Validate email: standard email regex
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail) {
        return next(errorHandler(400, "Please enter a valid email address."));
      }
  
      // Validate password: minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
      const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
      if (!isValidPassword) {
        return next(errorHandler(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."));
      }
  
      // Check if the username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return next(errorHandler(409, "Username has been using" ));
      }
  
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(errorHandler(409, "Email is already registered"));
      }
  
      // Hash password before storing in MongoDB
      const hashedSignupPassword = bcryptjs.hashSync(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashedSignupPassword,
      });
  
      // Save new user to the database
      await newUser.save();
  
      // Create Token with user details (excluding password)
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
      );
  
      // Remove password from response
      const { password: hashedPassword, ...rest } = newUser._doc;
  
      // Set Token in Cookie with expiration
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // Expire in 24 hours
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'strict' // Helps mitigate CSRF attacks
        })
        .status(201)
        .json(rest);
    } catch (error) {
      next(error); // Pass unexpected errors to the error handler
    }
  };


/* Sign In */
export const signin = async (req, res, next) => {
    try {
      /* Check Email */
      const { email, password } = req.body;
  
      // Check if required fields are provided
      if (!email || !password) {
        return next(errorHandler(400, "Email and password are required"));
      }
  
      // Validate email format
      const isValidEmail = /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);
      if (!isValidEmail) {
        return next(errorHandler(400, "Please enter a valid email address."));
      }
  
      // Find the user in the database
      const user = await User.findOne({ email });
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }
  
  
      // Check if the password is correct
      const isMatch = bcryptjs.compareSync(password, user.password);
      if (!isMatch) {
        return next(errorHandler(401, "Invalid credentials"));
      }
  
      // Create Token /
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 1 hour
      );
  
      // Remove Password from Response /
      const { password: hashedPassword, ...rest } = user._doc;
  
      // Set Token in Cookie /
      const expiresDate = new Date(Date.now() + 1 * 60 * 60 * 1000); // Expire in 24 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiresDate,
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'strict' // Helps mitigate CSRF attacks
        })
        .status(200)
        .json(rest);
  
    } catch (error) {
      next(error);
    }
  };

export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};
