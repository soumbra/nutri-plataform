import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class ContractController {
    static create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAll(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=contract.controller.d.ts.map