const https = require(`https`);
const server = require('./loaders/serverLoader');










// 임시
// jwt 세션 등 추가될수도 있으니까
const options = {};

server.getServer(options).listen(8080, () => {
    console.log('asdasd');
});
