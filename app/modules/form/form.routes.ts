import { Router, Request, Response, NextFunction } from "express";
import { CreateFormValidator } from "./form.validations";
import formService from "./form.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";

const router = Router();

router.post('/create', CreateFormValidator, async (
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
router.get('/display', async (
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

router.put('/addRating', async (
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


router.get('/average', async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let filter = req.query
        const result = await formService.getAverage(filter);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

router.get('/history', async (
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
// router.get('/averageperform/:id', async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         let id =req.params.id
//         const result = await formService.getAveragePerForm(id);
//         res.send(new ResponseHandler(result));
//     } catch (error) {
//         next(error);
//     }
// });

// router.get('/filteraverage', async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const filter=req.query;
//         const result = await formService.filterAverage(filter);
//         res.send(new ResponseHandler(result));
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// });


export default router;