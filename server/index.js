import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import db from './db';
import api from './api';

var app = express();
app.server = http.createServer(app);

app.use(express.static('./public'));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride('X-HTTP-Method-Override'));

db(() => {
    app.use('/api', api(app));
    process.on('SIGINT', () => {
        console.log("\nStopping...");
        process.exit();
    });
    app.server.listen(process.env.PORT || 8000);
    console.log(`Server started on port ${app.server.address().port}`);
});

export default app;
