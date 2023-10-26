import 'express-async-errors';

import express              from 'express';
import cors                 from 'cors';
import dotenv               from 'dotenv';
import bodyParser           from 'body-parser';
import { PrismaClient }     from '@prisma/client';
import { searchRoute }      from './routes/search.route';
import { guideRoute }       from './routes/guide.route';
import { authRoute }        from './routes/auth.route';
import { handleError }      from './middleware/handleError';
import { handleHttpError }  from './middleware/handleHttpError';

dotenv.config();

export const port   = process.env.PORT as string;
export const app    = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.use('/search', searchRoute);
app.use('/guide', guideRoute);
app.use('/auth', authRoute);

app.use(handleError);
app.use(handleHttpError);

app.listen(port, () => {
  console.log(`Express server is running at http://localhost:${port}`);
});
