import { Request, Response, Router } from 'express';
import UserModel from '../models/User.model';
import IUser from '../interfaces/IUser';
import QuestionModel from '../models/Question.model';
import IQuestion from '../interfaces/IQuestion'
import { urlencoded } from 'body-parser';
import IQuestionSubSchema from '../interfaces/IQuestionSubSchema';

export default class HelloWorld {

    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        //setup Routes
        this.router.get('/', this.getUserList);
        this.router.get('/:deviceId', this.getUserById);
        this.router.post('/', this.createUser);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
        this.router.put('/:id/sub', this.scoreUpdate);
        return this.router;
    }

    private getUserList(req: Request, res: Response) {
        UserModel.find()
            .exec((err: any, users: IUser[]) => {
                if(err) {return res.status(500).json(err);}
                res.json(users);
            });
    }

    private getUserById(req: Request, res: Response) {
        
        UserModel.findOne({deviceId : req.params.id}, (err: any, user: IUser) => {
            if (err || !user) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No User with an id of: ' + req.params.id }); }
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
        UserModel.findOneAndDelete({deviceId : req.params.id}, (err: any, user: IUser | null) => {
            if (err || !user) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No User with an id of: ' + req.params.id }); }

            res.json(user);
        });
    }

    private async scoreUpdate(req: Request, res: Response) {
        let score = 0;
           req.body.forEach((userData: IQuestionSubSchema) => {
                QuestionModel.findById(userData.questionId, (err: any, question: IQuestion) => {
                    if(err) {return res.status(500).json(err)}
                    if(userData.submission == question.correctAnswer) {
                        userData.isAnswerCorrect = true;
                        score++;
                    }
                    UserModel.findOne({deviceId : req.params.id}, (err: any, user: IUser) => {
                        if(err) {res.status(400).json({message: "kein User mit der id" + req.params.id})}
                        let userDataAcc = user.submissions;
                        userDataAcc.push(userData);

                        let userUpdate = {
                            score: user.score + score,
                            submissions: userDataAcc,
                            questionId: userData.questionId
                        }
                        UserModel.findOneAndUpdate({deviceId : req.params.id}, userUpdate, {new:true}, (err: any, user: any) => {
                            if(err) {res.status(500).json(user);}
                            res.json(user);
                        })
                        
                    })
                    
                });

        })
        
        
    }
    


}