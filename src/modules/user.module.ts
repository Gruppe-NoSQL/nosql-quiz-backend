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
        this.router.get('/:deviceId/isRegistered', this.isUserRegistered);
        this.router.post('/', this.createUser);
        this.router.put('/:deviceId/sub', this.scoreUpdate);
        this.router.delete('/', this.deleteUser);
        return this.router;
    }

    private deleteUser(req: Request, res: Response) {
        UserModel.deleteMany({}, (err: any) => {
            res.json(err);
        })
    }

    private getUserList(req: Request, res: Response) {
        UserModel.find()
            .sort('-score')
            .exec((err: any, users: IUser[]) => {
                if (err) { return res.status(500).json(err); }
                res.json(users);
            });
    }

    private getUserById(req: Request, res: Response) {
        UserModel.findOne({ deviceId: req.params.deviceId }, (err: any, user: IUser) => {
            if (err || !user) { return err ? res.status(500).json(err) : res.status(400).json({ 'message': 'No User with an id of: ' + req.params.id }); }
            res.json(user);
        });
    }

    private isUserRegistered(req: Request, res: Response) {
        UserModel.findOne({ deviceId: req.params.deviceId }, (err: any, user: IUser) => {
            if (user) {
                return res.json({ isRegistered: true });
            }
            res.json({ isRegistered: false });
        })
    }

    private createUser(req: Request, res: Response) {
        UserModel.findOne({ deviceId: req.body.deviceId }, (err: any, user: IUser | null) => {
            if (user) { return res.status(400).json({ message: "Es existiert bereits ein Nutzer mit dieser deviceId" }); }

            UserModel.create(req.body, (err: any, user: IUser | any) => {
                if (err) { return res.status(400).json(err); }
                res.status(201).json(user);
            });
        })
    }

    private scoreUpdate(req: Request, res: Response) {
        console.log(req.body);
        UserModel.findOne({ deviceId: req.params.deviceId }, (err: any, user: IUser) => {

            let questionIds = req.body.map((userSubmission: IQuestionSubSchema) => {
                return userSubmission.questionId;
            });

            QuestionModel.find({ '_id': { $in: questionIds } }, (err: any, questionDocs: Array<IQuestion>) => {
                if (err) { return res.status(500).json({ err: err }) }

                for (let i = 0; i < questionDocs.length; i++) {

                    req.body[i].isAnswerCorrect = (questionDocs[i].correctAnswer == req.body[i].submission);
                }

                let score: number = req.body.reduce((acc: number, curr: any) => {
                    if (curr.isAnswerCorrect) {
                        acc++;
                    }

                    return acc;
                }, user.score);
                user.submissions = user.submissions.concat(req.body);
                let userUpdate: any = {
                    score: score,
                    submissions: user.submissions,
                    isFinished: true
                }

                UserModel.findOneAndUpdate({ deviceId: req.params.deviceId }, userUpdate, { new: true }, (err: any, user: any) => {
                    if (err) { return res.status(500).json({ message: "kein user mit der deviceid" + req.params.deviceId }) };
                    res.json({
                        message: "user was updated successfully"
                    });
                });
            });
        })
    }
}