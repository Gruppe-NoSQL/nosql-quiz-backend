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
        .then((users: IUser[]) => {
            res.json(users);       
        })
        .catch(err => res.status(500).json(err));
    }

    private getUserById(req: Request, res: Response) {
        UserModel.findById(req.params.id, (err: any, user: IUser) => {
            if(err || !user) { return err? res.status(500).json(err): res.status(400).json({'message': 'No User with an id of: ' + req.params.id}); }

            res.json(user);
        });
    }

    private createUser(req: Request, res: Response) {
        UserModel.create(req.body, (err: any, user: IUser | any) => {
            if(err) { return res.status(400).json(err); }
            res.json(user);
        });
    }

    private updateUser(req: Request, res: Response) {
        UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err: any, user: IUser | null) => {
            if(err || !user) { return err? res.status(500).json(err): res.status(400).json({'message': 'No User with an id of: ' + req.params.id}); }

            res.json(user);
        });
    }

    private deleteUser(req: Request, res: Response) {
        UserModel.findByIdAndDelete(req.params.id, (err: any, user: IUser | null) => {
            if(err || !user) { return err? res.status(500).json(err): res.status(400).json({'message': 'No User with an id of: ' + req.params.id}); }

            res.json(user);
        });
    }



}