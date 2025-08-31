const {check} = require("express-validator")
const User = require("../models/user");

const registerValidator = [
  check("email")
    .isEmail()
    .withMessage("Enter proper e-mail address")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error(`User with email: ${existingUser.email} alerdy exists`);
      }
      return true;
    }),


  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long")

    .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Please ensure your password is at least 8 characters long, has at least one uppercase and lowercase letters and one special symbol."
      ),

  check("username")
    .notEmpty()
     .isLength({ min: 3 })
    .withMessage("Username can`t be empty"),
];

module.exports =  {registerValidator};