import { Request, Response, Router } from 'express';
import QuestionModel from '../models/Question.model';
import IQuestion from '../interfaces/IQuestion'
import { Timestamp } from 'mongodb';
import IQuestionSubSchema from '../interfaces/IQuestionSubSchema';


export default class HelloWorld {

    private readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        //setup Routes
        this.router.get('/', this.getQuestionList);
        this.router.get('/:id', this.getQuestionById);
        this.router.post('/', this.createQuestion);
        return this.router;
    }

    private getQuestionList(req: Request, res: Response) {
        QuestionModel.find((err: any, questions: Array<IQuestion>) => {
            if (err) { return res.status(500).json(err); }
            //remove solutions, unless it is for evaluation at the end
            if (req.query.solutions == "true") {
                return res.json(questions);
            }
            res.json(questions.map((question: IQuestion) => {
                question.correctAnswer = "";
                return question;
            }));
        });
    }

    private getQuestionById(req: Request, res: Response) {
        QuestionModel.findById(req.params.id, (err: any, question: IQuestion) => {
            if (err || !question) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No Question with an id of: ' + req.params.id }); }
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