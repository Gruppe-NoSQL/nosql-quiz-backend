import { Request, Response, Router } from 'express';

export default class HelloWorld {

    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router{
        //setup Routes
        this.router.get('/hello', this.sendHelloWorld);
        return this.router;
    }

    private sendHelloWorld(req: Request, res: Response) {
        res.send('Hello World');
    }
}