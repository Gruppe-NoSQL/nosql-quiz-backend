import express from "express";
import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import morgan from 'morgan';
import mongoose from 'mongoose'

import * as config from './config.json';

import Routes from './modules/routes.module';

//setup environment variables
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

let env: any = dotenv.parse(fs.readFileSync(path.join(__dirname, '../process.env')));

console.log(env.DATABASE_URL);

//setup mongoDB connection
mongoose.connect(env.DATABASE_URL, { useNewUrlParser:true });

//setup app
const app = express();

//setup app config
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(compression());
app.use(cors());
app.use(morgan('dev'));

//setup routes
const routes: Routes = new Routes();
app.use('/', routes.getRouter());

//listen on port 3001
app.listen(config.server.port, () => console.log(config.server.startMessage));