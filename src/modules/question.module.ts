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
        this.router.put('/:id', this.updateQuestion);
        this.router.delete('/:id', this.deleteQuestion);
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
       //find the question with id: req.params.id, when found, call callback function and pass the question object and / or optionally the error 
       QuestionModel.findById(req.params.id, (err: any, question: IQuestion) => {
           //if an error exists: send the error with HTTP code 500 as response and return; if the question cannot not be found: send a message with the userid and HTTP code 400 as response and return
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

    private updateQuestion(req: Request, res: Response) {
        QuestionModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err: any, question: IQuestion | null) => {
            if (err ||  question) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No Question with an id of: ' + req.params.id }); }

            res.json(question);
        });
    }

    private deleteQuestion(req: Request, res: Response) {
        QuestionModel.findByIdAndDelete(req.params.id, (err: any, question: IQuestion | null) => {
            if (err || !question) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No Question with an id of: ' + req.params.id }); }

            res.json(question);
        });
    }

    



}