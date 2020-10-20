import { Request, Response, Router } from 'express';
import QuestionModel from '../models/Question.model';
import IQuestion from '../interfaces/IQuestion'
import { Timestamp } from 'mongodb';
import IQuestionSubSchema from '../interfaces/IQuestionSubSchema';
import UserModel from '../models/User.model';
import IUser from '../interfaces/IUser';


export default class HelloWorld {

    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        //setup Routes
        this.router.get('/:deviceId', this.getQuestionList);
        this.router.get('/:deviceId', this.getQuestionById);
        this.router.post('/', this.createQuestion);
        return this.router;
    }

    private getQuestionList(req: Request, res: Response) {
        QuestionModel.find((err: any, questions: Array<IQuestion>) => {
            if (err) { return res.status(500).json(err); }
            UserModel.findOne({ deviceId: req.params.deviceId }, (err: any, user: IUser) => {
                //remove solutions, unless user has alreay finished the quiz
                if (!user) { res.status(400).json({ message: "Kein User mit der deviceId" + req.params.deviceId }) }
                if (user.isFinished) {
                    return res.json(questions);
                }
                res.json(questions.map((question: IQuestion) => {
                    question.correctAnswer = "";
                    return question;
                }));
            }
            )
        });
    }

    private getQuestionById(req: Request, res: Response) {
        QuestionModel.findById(req.params.deviceId, (err: any, question: IQuestion) => {
            if (err || !question) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No Question with an id of: ' + req.params.deviceId }); }
            res.json(question);
        });

    }

    private createQuestion(req: Request, res: Response) {
        QuestionModel.create(req.body, (err: any, question: IQuestion | any) => {
            if (err) { return res.status(400).json(err); }
            res.json(question);
        });
    }

}