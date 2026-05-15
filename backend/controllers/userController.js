const User = require("../models/User"); // Importing the User model
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for token generation
const sendEmail = require("../utils/emailService");
const crypto = require("crypto");

const sanitizeUser = (user) => {
  if (!user) return null;
  const userObject = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  return userObject;
};

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

// Controller function for user registration
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extracting username, email, and password from request body
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }); // Creating a new user
    res.status(201).json({ user: sanitizeUser(user) }); // Never expose password hashes.
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handling errors
  }
};

// Controller function for user login
exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extracting login identifier and password from request body
    const identifier = username || email;
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: String(identifier || "").toLowerCase() },
      ],
    }); // Finding the user by username or email
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" }); // Handling invalid username
    }
    const isValidPassword = await user.isValidPassword(password); // Validating password
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid username or password" }); // Handling invalid password
    }
    // Generating JWT token
    const tokenData = {
      _id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: 60 * 60 * 8,
    });

    // Cross-site production cookies are required for Vercel frontend -> Render API auth.
    const tokenOption = getAuthCookieOptions();
    // Setting token in cookie and sending success response
    res.cookie("token", token, tokenOption).status(200).json({
      message: "Login successfully",
      userId: user.id,
      role: user.isAdmin,
      user: sanitizeUser(user),
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handling errors
  }
};

// Controller function for ForgottenPassword
exports.forgotPassword = async (req, res) => {
  const mail = req.body.email;
  const user = await User.findOne({ email: mail });
  if (!user) {
    return res.status(400).json("User does not exist");
  }
  const resetToken = await user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/passwordReset/${resetToken}`;

  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.\n TOKEN : ${resetToken}\n http://localhost:5173/reset-password/${resetToken} `;

  try {
    await sendEmail(user.email, "Password Change Request Received", message);
    res.status(200).json({
      message: "A link to change your password has been sent to your registered Email " + user.email,
      status: "Success",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: "There was an issue with your email", error: error.message });
  }
};

exports.passwordReset = async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json("Token is invalid or has expired");
  }
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  //updating the new Password in database and removing tokens
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.passwordChangeAt = Date.now();
  //saving this information into database
  await user.save();
  //returning json response
  res.send({
    status: "success",
    message: `Your Password Has Been Changed Successfully!`,
  });
};

// Controller function for user logout
exports.logout = (req, res) => {
  try {
    // Clearing token cookie and sending success response
    res.clearCookie("token", getAuthCookieOptions());
    res.status(200).json({
      message: "Logged out Successfully",
      error: false,
      success: true,
      data: [],
    });
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handling errors
  }
};

// Controller function to get user profile
exports.getProfile = async (req, res) => {
  try {
    // Finding user by ID and sending user details in response
    const user = await User.findById(req.userId).select("-password -resetPasswordToken -resetPasswordExpire");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      })
    }
    res.status(200).json({
      data: sanitizeUser(user),
      error: false,
      success: true,
      message: "User details",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Controller function to create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName,lastName,username, email, password, isAdmin } = req.body; 

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" }); // Handling missing fields
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ firstName,lastName,username, email, password: hashedPassword, isAdmin }); // Creating a new user
    res.status(201).json(sanitizeUser(newUser)); // Sending sanitized response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handling errors
  }
};

// Controller function to get all users with pagination, limit, and search
exports.getAllUsers = async (req, res) => {
  try {
    let query = {};
    // Check if isAdmin query parameter exists
    const { isAdmin, search } = req.query;
    if (isAdmin) {
      query.isAdmin = isAdmin;
    }
    // Check if search query parameter exists
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      query.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
      ];
    }
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameters, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10
    const skip = (page - 1) * limit; // Calculating the number of documents to skip

    let usersQuery = User.find(query).select("-password -resetPasswordToken -resetPasswordExpire").skip(skip).limit(limit); // Finding all users

    // Check if sorting query parameter exists
    const { sortBy } = req.query;
    const sortOptions = {};
    if (sortBy === "firstName" || sortBy === "lastName" || sortBy === "email" || sortBy === "username") {
      // Sorting by firstName, lastName, email, or username
      sortOptions[sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "isAdmin") {
      // Sorting by isAdmin
      sortOptions.isAdmin = req.query.sortOrder === "desc" ? -1 : 1;
    }

    const users = await usersQuery.sort(sortOptions).exec();
    const totalUsersCount = await User.countDocuments(query);

    // Calculating total pages
    const totalPages = Math.ceil(totalUsersCount / limit);

    res.json({
      users,
      currentPage: page,
      totalPages,
    }); // Sending response with all users
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handling errors
  }
};


exports.GetAllUsers = async (req,res) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpire")
    res.status(200).json(users)
  } catch (error) {
    res.status(404).json(error)
  }
}

// Controller function to get a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId; // Extracting user ID from request parameters
    const requester = await User.findById(req.userId).select("isAdmin");
    if (String(req.userId) !== String(userId) && !requester?.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpire"); // Finding user by ID
    if (!user) {
      res.status(404).json({ message: "User not found" }); // Handling user not found
    } else {
      res.json(sanitizeUser(user)); // Sending response with the found user
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handling errors
  }
};

// Controller function to update a user's details
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Extracting user ID from request parameters
    delete req.body.password;
    delete req.body.resetPasswordToken;
    delete req.body.resetPasswordExpire;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }).select("-password -resetPasswordToken -resetPasswordExpire"); // Updating user details
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" }); // Handling user not found
    } else {
      res.json(sanitizeUser(updatedUser)); // Sending response with the updated user
    }
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handling errors
  }
};

// Controller function to delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Extracting user ID from request parameters
    const deletedUser = await User.findByIdAndDelete(userId); // Deleting user by ID
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" }); // Handling user not found
    } else {
      res.json({ message: "User deleted successfully" }); // Sending success response
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handling errors
  }
};

exports.CountUsers = async(req,res) => {
  const count=await User.countDocuments();
  res.json(count);
}
