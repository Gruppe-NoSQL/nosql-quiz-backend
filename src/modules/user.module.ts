import { Request, Response, Router } from 'express';
import UserModel from '../models/User.model';

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
        .then((users) => {
            res.json(users)       
        })
        .catch(err => res.status(500).json(err));
    }

    private getUserById(req: Request, res: Response) {
        UserModel.findById(req.params.id)
        .then((user) => {
            res.json(user);
        })
        .catch(err => res.status(500).json(err));
    }

    private createUser(req: Request, res: Response) {
        UserModel.create(req.body)
            .then((user) => {
                res.json(user);
            })
            .catch(err => res.status(500).json(err));
    }

    private updateUser(req: Request, res: Response) {
        UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true})
        .then((user) => {
            res.json(user);
        })
        .catch(err => res.status(500).json(err));
    }

    private deleteUser(req: Request, res: Response) {
        UserModel.findByIdAndDelete(req.params.id)
        .then((user) => {
            res.send("User " + req.params.id + " wurde erfolgreich gelöscht");
        })
    }



}