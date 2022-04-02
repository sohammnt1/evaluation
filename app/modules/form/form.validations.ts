import { body } from "express-validator";
import validate from "../../utility/validate";

export const CreateFormValidator = [
  body("studentId").isString().withMessage("Enter a studentId"),
  body("track").isString().withMessage("Enter a valid track"),
  //body("lastEvaluated").isString().withMessage("Enter a valid lastEvaluated"),
  body("trainersAssigned.*")
    .isString()
    .withMessage("Enter a valid trainersAssigned"),
  body("rating.*.LogicRating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Enter a valid LogicRating"),
  body("rating.*.CommunicationRating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Enter a valid CommunicationRating"),
  body("rating.*.AssignmentRating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Enter a valid AssignmentRating"),
  body("rating.*.ProActivenessRating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Enter a valid ProActivenessRating"),
  validate,
];

export const AddRatingsValidator = [
  body("formId").isString().withMessage("Enter a formId"),
  body("rating.LogicRating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Enter a valid LogicRating"),
  body("rating.CommunicationRating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Enter a valid CommunicationRating"),
  body("rating.AssignmentRating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Enter a valid AssignmentRating"),
  body("rating.ProActivenessRating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Enter a valid ProActivenessRating"),
  validate,
];
