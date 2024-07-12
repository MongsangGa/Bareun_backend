const express = require(`express`);
const router = express.Router();
const db = require(`../db/mysql`);

/**
 * 로그인
 * @param userID 
 * @param userPW
 * @returns E0001 클라이언트 측 파라미터 오류
 * @returns E0002 아이디 최대 길이 초과
 * @returns E0003 클라이언트 측 파라미터 오류
 * @returns E0004 아이디 또는 비밀번호 불일치
 * @returns S0001 로그인 성공
 */
router.get('/login', async (req, res) => {
    try {
        userID = req.query.userID;
        userPW = req.query.userPW;
        
        if (userID.length > 20) {
            res.status(200).send('E0002'); 
        } else if (userPW.length > 20) {
            res.status(200).send('E0003');
        } else if (userID === undefined || userID === null || userPW === undefined || userPW === null) {
            throw error; 
        } else { 
            result = await db.doCallProcedure('CALL GET_LOGIN(?, ?)', [userID, userPW]); 
            if (result[0][0].length == 0) {
                res.status(200).send('E0004'); 
            } else {
                res.status(200).send('S0001'); 
            }
        }
    } catch (error) {
        res.status(400).send('E0001'); 
    }
});

/**
 * 아이디 중복 확인
 * @param userID 
 * @returns E0001 클라이언트 측 파라미터 오류
 * @returns E0002 아이디 최대 길이 초과
 * @returns E0003 이미 사용중인 아이디
 * @returns S0001 사용 가능
 */
router.get('/idCheck', async (req, res) => {
    try {
        userID = req.query.userID;
        if (userID.length > 20) {
            res.status(200).send('E0002'); 
        } else if (userID === undefined || userID === null) {
            throw error;
        } else {
            result = await db.doCallProcedure('CALL GET_ID_CHECK(?)', [userID]); 
            if (result[0][0].length == 0) {
                res.status(200).send('S0001');
            } else {
                res.status(200).send('E0003');
            }
        }
    } catch (error) {
        res.status(400).send('E0001');
    }
});

module.exports = router;