import App from '@/app';
import IndexRoute from '@routes/index.route';
import MetadataRoute from '@routes/metadata.route';
import validateEnv from '@utils/validateEnv';
import { log } from 'console';
import EventRoute from './routes/event.route';

validateEnv();

try {
  const app = new App([new IndexRoute(), new MetadataRoute(), new EventRoute()]);
  app.listen();
} catch (error) {
  log(error);
}
