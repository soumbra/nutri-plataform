import { Request, Response } from 'express';
import { AuthRequest } from '../types';
export declare class FoodController {
    private static validateAuth;
    private static parseFoodFilters;
    private static parsePagination;
    private static parseNutritionalSearch;
    private static handleError;
    private static sendSuccessResponse;
    private static sendCustomSuccessResponse;
    static getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static delete(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPopular(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static searchByNutrition(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=food.controller.d.ts.map