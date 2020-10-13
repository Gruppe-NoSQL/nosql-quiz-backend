import { Request, Response, Router } from 'express';
import UserModel from '../models/User.model';

export default class HelloWorld {

    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router{
        //setup Routes
        this.router.post('/', this.createUser);
        return this.router;
    }

    private createUser(req: Request, res: Response) {
        console.log(req.body);
        UserModel.create(req.body)
        .then((user)=> {
            console.log(user);
            res.json(user);
        })
        .catch((err) => {
            res.json({err: err});
        });
    }

    
}