import { Request, Response } from 'express';
import { Dish } from '../entity/Dish.entity';
import { Step } from '../entity/Step.entity';

export class StepController {
    public static async createStep(req: Request, res: Response): Promise<void> {
        const dish: Dish = res.locals.dish;
        const { content, number } = req.body;
        const newStep = await new Step(content, number, dish).save();
        res.status(200).send(newStep);
    }

    public static async updateStep(req: Request, res: Response): Promise<unknown> {
        const stepId: string = res.locals.stepId;

        const originalStep: Step = await Step.findOne({ id: stepId });
        if (!originalStep) {
            return res.status(400).send({ message: 'No step with this id found' });
        }

        Object.assign(originalStep, req.body);
        const updatedStep = await Step.save(originalStep);
        res.status(200).send(updatedStep);
    }

    public static async removeStep(req: Request, res: Response): Promise<void> {
        const stepId: string = res.locals.stepId;
        await Step.delete({ id: stepId });
        res.sendStatus(204);
    }
}
