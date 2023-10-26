import express         from 'express';
import dotenv          from 'dotenv';
import { searchRoute } from './routes/search.route';

dotenv.config();

export const port = process.env.PORT as string;
export const app  = express();

app.use('/search', searchRoute);

app.listen(port, () => {
  console.log(`Express server is running at http://localhost:${port}`);
});
