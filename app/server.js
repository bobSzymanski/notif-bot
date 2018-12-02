import Promise from 'bluebird';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import discord from './services/discord';
import { health, webhooks } from './routes';
import { errorHandler } from './middlewares';
import { mongoConnect } from './utils/mongo';

const app = express();

app.use(bodyParser.json({ limit: '256kb' }));
app.use(cors());

app.use('/', health);
app.use('/health', health);
app.use('/v1/webhooks', webhooks);

app.use(errorHandler.notFoundError);
app.use(errorHandler.error);


// Mongo && discord connections are async, 
// Use health check to verify connected before use.
discord();
mongoConnect();

export default Promise.resolve(app);
