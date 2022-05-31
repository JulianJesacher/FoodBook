import { Request, Response } from 'express';
import express = require('express');

export class StepMiddleware {
    public static getStepId(req: Request, res: Response, next: express.NextFunction): unknown {
        const stepId: string = req.params.stepId;
        if (!stepId) {
            return res.status(400).send({ message: 'No stepId was specified' });
        }
        res.locals.stepId = stepId;
        next();
    }
}
