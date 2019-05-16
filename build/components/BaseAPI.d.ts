import { Application, Router } from 'express';
export declare abstract class BaseApi {
    protected router: Router;
    protected constructor();
    abstract register(express: Application): void;
}
