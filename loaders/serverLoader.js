const express = require(`express`);
const cors = require(`cors`);
const bodyParser = require(`body-parser`);
const helmet = require(`helmet`);
const routes = require('./serverRoutes');

function getServer(options) {
    
    const app = express();

    // cors 설정
    app.use(cors({ origin: true, credentials: true }));
    app.use(helmet({ crossOriginResourcePolicy: false, }));
    
    // routes 설정
    app.use(`/api`, routes);

    // 미들웨어
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    // app.use(express.static(path.join(__dirname, '../../public')));  
    // app.use('/Uploads', express.static(path.join(path.dirname(process.execPath), 'Uploads')));
    // appUseCallback(app);

    return app;
}

module.exports = { 
    getServer 
};