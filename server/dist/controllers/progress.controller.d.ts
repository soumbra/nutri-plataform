import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class ProgressController {
    static create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAll(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getChartData(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getClientProgress(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=progress.controller.d.ts.map