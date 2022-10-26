import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './config/Database.js';
import AuthRouter from './routes/AuthRoute.js';
import userRouter from './routes/UserRoute.js';
import CategoryRouter from './routes/CategoryRoute.js';
import PostRouter from './routes/PostRoute.js';
import CommentRouter from './routes/CommentRoute.js';
import { isAdmin } from './middleware/RoleMiddleware.js';
import { getLog } from './controllers/LogController.js';
import morganMiddleware from './middleware/morgan.middleware.js';

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log('Database Connected');
} catch (error) {
  console.log(error);
}

app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://10.10.101.82:3000'] }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static('public'));
app.use(express.json());
app.use(morganMiddleware);

app.use(AuthRouter); //memanggil routing Auth
app.use('/users', userRouter); //memanggil routing user
app.use('/forum', CategoryRouter); //memanggil routing category
app.use('/forum', PostRouter); //memanggil routing post
app.use('/forum', CommentRouter); //memanggil routing comment
app.get('/log', isAdmin, getLog);

app.listen(process.env.APP_PORT, '10.10.101.82', () => console.log(`server up and running on port ${process.env.APP_PORT}`));
// app.listen(process.env.APP_PORT, () => console.log(`server up and running on port ${process.env.APP_PORT}`));
