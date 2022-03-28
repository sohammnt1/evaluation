import { Request, Response, NextFunction, Router } from "express";
import { verifyToken } from "./jwt";
import { ResponseHandler } from "./response";

export const permit = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const roleArray = res.locals.user.roles;
        if (!roles.some(role => roleArray.includes(role))) {
            return res.status(401).send(new ResponseHandler({ message: 'Unauthorized' }));
        }
        next();
    }
}

export const authorize = (excludedPaths: { method: string, route: string }[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (excludedPaths.find(path => path.method === req.method && path.route === req.url)) return next();
            const token = req.headers.authorization;
            const user = verifyToken(token);
            res.locals.user = user;
            next();
        } catch (e) {
            res.status(403).send(new ResponseHandler({ message: "Forbidden" }));
        }
    }
}