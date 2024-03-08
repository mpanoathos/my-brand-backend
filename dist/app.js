import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
// import expressLayout from 'express-ejs-layouts';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// import { isActiveRoute } from './helpers/routerHelpers';
import connectDB from './config/db.js';
import routes from './routes/route.js';
import admin from './routes/admin.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./config/swagger.yaml');
const app = express();
const PORT = 5000 || process.env.PORT;
// Connect to the database
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
    // cookie: { maxAge: new Date(Date.now() + 3600000) },
}));
// Templating engine
// app.use(expressLayout);
// app.set('layout', './layout/main');
// app.set('view engine', 'ejs');
// app.locals.isActiveRoute = isActiveRoute;
app.use('/', routes);
app.use('/', admin);
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
export default app;
//# sourceMappingURL=app.js.map