import { Router, Request, Response, NextFunction } from "express";
import { CreateFormValidator } from "./form.validations";
import formService from "./form.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";

const router = Router();

router.post('/create',permit([ROLES.Admin,ROLES.Trainer]), CreateFormValidator, async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const form = req.body;
        const result = await formService.createForm(form);
        res.send(new ResponseHandler(result));
    } catch (error) {
        console.log(error)
        next(error);
    }
});

//display user by role must be kept open
router.get('/display',permit([ROLES.Admin,ROLES.Trainer]), async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await formService.displayForms();
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

router.put('/addRating',permit([ROLES.Admin,ROLES.Trainer]), async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const ratingData = req.body;
        const result = await formService.addRating(ratingData);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});


router.get('/average',permit([ROLES.Admin,ROLES.Trainer]), async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {role,_id}=res.locals.user
        let filter = req.query
        const result = await formService.getAverage(filter,role,_id);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

router.get('/history',permit([ROLES.Admin,ROLES.Trainer]), async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let {studentId} = req.query
        const result = await formService.getHistoryRatings(studentId);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

export default router;