import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './config/Database.js';
import AuthRouter from './routes/AuthRoute.js';
import userRouter from './routes/UserRoute.js';
import MainForumRouter from './routes/MainForumRoute.js';
import SubForumRouter from './routes/SubForumRoute.js';
import DiscussionRouter from './routes/DiscussionRoute.js';

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log('Database Connected');
} catch (error) {
  console.log(error);
}

app.use(cors({ credentials: true, origin: process.env.ORIGIN_CORS }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static('public'));
app.use(express.json());
app.use(AuthRouter); //memanggil routing Auth
app.use('/users', userRouter); //memanggil routing user
app.use('/forum', MainForumRouter); //memanggil routing main forum
app.use('/forum', SubForumRouter); //memanggil routing sub forum
app.use('/forum', DiscussionRouter); //memanggil routing diskusi

app.listen(process.env.APP_PORT, () => console.log(`server up and running on port ${process.env.APP_PORT}`));
