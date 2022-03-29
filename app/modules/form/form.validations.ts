import { body } from "express-validator";
import validate from "../../utility/validate";

export const CreateFormValidator = [
    body("studentId").isString().withMessage("Enter a studentId"),
    body("name").isString().withMessage("Enter a name"),
    body("age").isNumeric().withMessage("Enter a age"),
    body("email").isEmail().withMessage("Enter a valid email."),
    body("track").isString().withMessage("Enter a valid track"),
    //body("lastEvaluated").isString().withMessage("Enter a valid lastEvaluated"),
    body("trainersAssigned").isArray().withMessage("Enter a valid trainersAssigned"),
    body("rating").isArray().withMessage("Enter a valid rating"),
    validate
];
