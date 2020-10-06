import { Router } from 'express';

//Import Modules
import HelloWorldModule from './helloworld.module';

export default class Routes{
    private readonly router: Router;

    constructor(){
        this.router = Router();
    }

    public getRouter(): Router{
        this.router.use('/', new HelloWorldModule().getRouter());

        return this.router;
    }
}