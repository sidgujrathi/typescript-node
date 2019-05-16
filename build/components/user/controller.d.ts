import { Application, Request, Response } from 'express';
import { BaseApi } from '../BaseAPI';
import { IReqAuth } from '../../middleware/auth';
export declare class UserApi extends BaseApi {
    constructor();
    register(express: Application): void;
    signup(req: Request, res: Response): Promise<void>;
    signin(req: Request, res: Response): Promise<void>;
    fetch(req: IReqAuth, res: Response): Promise<void>;
    fetchAll(req: IReqAuth, res: Response): Promise<void>;
    private init;
}
