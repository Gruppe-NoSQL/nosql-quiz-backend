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
        return this.router;
    }

    private getUserList(req: Request, res: Response) {
        UserModel.find()
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
        UserModel.create(req.body, (err: any, user: IUser | any) => {
            if (err) { return res.status(400).json(err); }
            res.json(user);
        });
    }

    private scoreUpdate(req: Request, res: Response) {
        //define Promise
        let analyzeOneSubmissionPromise = (userSubmission: IQuestionSubSchema) => {
            return new Promise((resolve: (userUpdate: IQuestionSubSchema) => void, reject: (err: any) => void) => {
                QuestionModel.findById(userSubmission.questionId, (err: any, question: IQuestion) => {
                    if (!question) { return reject({ err: "Fragen nicht gefunden", status: 500 }) }
                    userSubmission.isAnswerCorrect = (userSubmission.submission == question.correctAnswer);
                    resolve(userSubmission);
                });
            })
        }

        UserModel.findOne({ deviceId: req.params.deviceId }, (err: any, user: IUser) => {
            //create Promises for every question/answer pair
            let promises: Array<IQuestionSubSchema> = req.body.map((userSubmission: IQuestionSubSchema) => {
                return analyzeOneSubmissionPromise(userSubmission);
            });
            console.log(promises);
            //wait for all promises to finish, then send confirmation
            Promise.all(promises)
                .then((userSubmissions: Array<IQuestionSubSchema>) => {
                    let score: number = userSubmissions.reduce((acc: number, curr: any) => {
                        if (curr.isAnswerCorrect) {
                            acc++;
                        }
                        console.log(acc);
                        return acc;
                    }, user.score);
                    user.submissions = user.submissions.concat(userSubmissions);
                    let userUpdate: any = {
                        score: score,
                        submissions: user.submissions,
                        isFinished: true
                    }
                    UserModel.findOneAndUpdate({ deviceId: req.params.deviceId }, userUpdate, { new: true }, (err: any, user: any) => {
                        if (err) {
                            return res.status(500).json({ message: "kein user mit der deviceid" + req.params.deviceId })
                        };
                    });
                    res.json({
                        message: "user was updated successfully"
                    });
                })
                .catch((err: any) => {
                    res.status(500).json(err);
                    console.log(err);
                })
        });
    }
}