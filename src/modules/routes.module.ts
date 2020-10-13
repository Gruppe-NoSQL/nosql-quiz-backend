import { Router } from 'express';
import UserModel from '../models/User.model';

//Import Modules
import HelloWorldModule from './helloworld.module';
import UserModule from './user.module';

export default class Routes{
    private readonly router: Router;

    constructor(){
        this.router = Router();
    }

    public getRouter(): Router{
        this.router.use('/', new HelloWorldModule().getRouter());

        this.router.use('/user', new UserModule().getRouter());

        return this.router;
    }
}