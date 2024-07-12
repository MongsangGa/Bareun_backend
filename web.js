const https = require(`https`);
const server = require('./loaders/serverLoader');










// 임시
// jwt 세션 등 추가 고려
const options = {

};

server.getServer(options).listen(7896, () => {
    console.log('바른발음 서버 시작');
});
