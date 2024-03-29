import { Router, Request, Response, NextFunction } from "express";
import { CreateFormValidator, AddRatingsValidator } from "./form.validations";
import formService from "./form.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";

const router = Router();

router.post(
  "/create",
  permit([ROLES.Admin, ROLES.Trainer]),
  CreateFormValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = req.body;
      const result = await formService.createForm(form);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

//display user by role must be kept open
router.get(
  "/display",
  permit([ROLES.Admin, ROLES.Trainer]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page as string;
      const itemsPerPage = req.query.itemsPerPage as string;
      const result = await formService.displayForms(+page, +itemsPerPage);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/add-rating",
  AddRatingsValidator,
  permit([ROLES.Admin, ROLES.Trainer]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ratingData = req.body;
      const result = await formService.addRating(ratingData);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/average",
  permit([ROLES.Admin, ROLES.Trainer]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, _id } = res.locals.user;
      let filter = req.query;
      const result = await formService.getAverage(filter, role, _id);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/history",
  permit([ROLES.Admin, ROLES.Trainer]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let studentId = req.query.studentId as string;
      const result = await formService.getHistoryRatings(studentId);
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
