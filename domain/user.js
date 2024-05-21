const express = require(`express`);
const router = express.Router();

router.post('/login', (req, res) => {
    console.log(req.body.userID);
    console.log(req.body.userPW);

    res.status(200).send('test');
});

module.exports = router;