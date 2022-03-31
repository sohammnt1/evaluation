import { body } from "express-validator";
import validate from "../../utility/validate";

export const CreateUserValidator = [
  body("name").isString().withMessage("Enter a name"),
  body("email").isEmail().withMessage("Enter a valid email."),
  body("role").isString().withMessage("Enter a valid role"),
  validate,
];

export const LoginUserValidator = [
  body("employeeId").isString().withMessage("Enter a valid emp id."),
  body("password").isString().notEmpty().withMessage("Enter a vaid password."),
  validate,
];
