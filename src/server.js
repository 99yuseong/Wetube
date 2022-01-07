import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import MongoStore from 'connect-mongo';
import flash from 'express-flash';

import rootRouter from './routers/rootRouter';
import channelRouter from './routers/channelRouter';
import watchRouter from './routers/watchRouter';
import socialRouter from './routers/socialRouter';
import feedRouter from './routers/feedRouter';
import { localMiddleware } from './middleware';

const app = express();
const logger = morgan('dev');

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
        }),
    })
);
app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('assets'));
app.use(flash());
app.use(logger);
app.use(localMiddleware);

app.use('/', rootRouter);
app.use('/channel', channelRouter);
app.use('/watch', watchRouter);
app.use('/socialLogin', socialRouter);
app.use('/feed', feedRouter);

export default app;
