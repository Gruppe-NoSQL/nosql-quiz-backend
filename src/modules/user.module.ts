import { Request, Response, Router } from 'express';
import UserModel from '../models/User.model';
import IUser from '../interfaces/IUser';

export default class HelloWorld {

    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        //setup Routes
        this.router.get('/', this.getUserList);
        this.router.get('/:id', this.getUserById);
        this.router.post('/', this.createUser);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
        return this.router;
    }

    private getUserList(req: Request, res: Response) {
        UserModel.find()
            .populate('question')
            .exec((err: any, users: IUser[]) => {
                if(err) {return res.status(500).json(err);}
                res.json(users);
            });
    }

    private getUserById(req: Request, res: Response) {
        //find the user with id: req.params.id, when found, call callback function and pass the user object and / or optionally the error
        UserModel.findById(req.params.id, (err: any, user: IUser) => {
            //if an error exists: send the error with HTTP code 500 as response and return; if the user cannot not be found: send a message with the userid and HTTP code 400 as response and return  
            if (err || !user) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No User with an id of: ' + req.params.id }); }
            //otherwise send the user object as response
            res.json(user);
        });
    }

    private createUser(req: Request, res: Response) {
        UserModel.create(req.body, (err: any, user: IUser | any) => {
            if (err) { return res.status(400).json(err); }
            res.json(user);
        });
    }

    private updateUser(req: Request, res: Response) {
        UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err: any, user: IUser | null) => {
            if (err || !user) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No User with an id of: ' + req.params.id }); }

            res.json(user);
        });
    }

    private deleteUser(req: Request, res: Response) {
        UserModel.findByIdAndDelete(req.params.id, (err: any, user: IUser | null) => {
            if (err || !user) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No User with an id of: ' + req.params.id }); }

            res.json(user);
        });
    }



}