import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class MealPlanController {
    private static validateAuth;
    private static convertDates;
    private static parseMealPlanFilters;
    private static parsePagination;
    private static handleError;
    private static sendSuccessResponse;
    private static sendCustomSuccessResponse;
    static create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAll(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static delete(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static addMeal(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateMeal(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static copyPlan(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static recalculateNutrition(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getStatistics(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=meal-plan.controller.d.ts.map