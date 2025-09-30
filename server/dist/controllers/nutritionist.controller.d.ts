import { Request, Response } from 'express';
import { AuthRequest } from '../types';
export declare class NutritionistController {
    static getAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getSpecialties(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=nutritionist.controller.d.ts.map