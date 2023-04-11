import App from '@/app';
import IndexRoute from '@routes/index.route';
import MetadataRoute from '@routes/metadata.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new MetadataRoute()]);

app.listen();
