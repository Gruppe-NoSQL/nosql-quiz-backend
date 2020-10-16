import { Request, Response, Router } from 'express';
import QuestionModel from '../models/Question.model';
import IQuestion from '../interfaces/IQuestion'
import { Timestamp } from 'mongodb';


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
        QuestionModel.find()
            .exec((err: any, questions: []) => {
                if(err) {return res.status(500).json(err);}
                res.json(questions);
            });
        }

    private getQuestionById(req: Request, res: Response) {
       QuestionModel.findById(req.params.id, (err: any, question: IQuestion) => {
        if (err || !question) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No Question with an id of: ' + req.params.id }); }
        res.json(question);
       });
   
    }

    private createQuestion(req: Request, res: Response) {
        QuestionModel.create(req.body, (err: any, question: IQuestion | any) =>{
            if(err){return res.status(400).json(err);}
            res.json(question);
        });
    }

}