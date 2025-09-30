import { Request, Response } from 'express';
import { AuthRequest } from '../types';
export declare class AuthController {
    static login(req: Request, res: Response): Promise<void>;
    static register(req: Request, res: Response): Promise<void>;
    static me(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=auth.controller.d.ts.map