import { Router, Request, Response, NextFunction } from "express";
import { CreateUserValidator, LoginUserValidator } from "./user.validations";
import userService from "./user.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";

const router = Router();

router.post('/register', CreateUserValidator, async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.body;
        const result = await userService.createUser(user);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

router.post('/login', LoginUserValidator, async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let { employeeId, password } = req.body;
        const result = await userService.authenticateUser(employeeId, password);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

router.get('/display', async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { role } = req.query;
        const result = await userService.displayUsers(role);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

router.put('/adminDashboard', CreateUserValidator, async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updated_data = req.body;
        const result = await userService.editUser(updated_data);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

router.delete('/adminDashboard/:employeeId', async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const employeeId = req.params.employeeId;
        const result = await userService.deleteUser(employeeId);
        res.send(new ResponseHandler(result));
    } catch (error) {
        next(error);
    }
});

export default router;