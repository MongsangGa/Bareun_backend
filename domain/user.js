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
            res.status(200).send({ result: 'E0002' }); 
        } else if (userPW.length > 20) {
            res.status(200).send({ result: 'E0003' });
        } else if (userID === undefined || userID === null || userPW === undefined || userPW === null) {
            throw error; 
        } else { 
            result = await db.doCallProcedure('CALL GET_LOGIN(?, ?)', [userID, userPW]); 
            if (result[0][0].length == 0) {
                res.status(200).send({ result: 'E0004' }); 
            } else {
                res.status(200).send({ result: 'S0001' }); 
            }
        }
    } catch (error) {
        res.status(400).send({ result: 'E0001' }); 
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
            res.status(200).send({ result: 'E0002' }); 
        } else if (userID === undefined || userID === null) {
            throw error;
        } else {
            result = await db.doCallProcedure('CALL GET_ID_CHECK(?)', [userID]); 
            if (result[0][0].length == 0) {
                res.status(200).send({ result: 'S0001' });
            } else {
                res.status(200).send({ result: 'E0003' });
            }
        }
    } catch (error) {
        res.status(400).send({ result: 'E0001' });
    }
});

/**
 * 회원가입
 * @param userName, phone, userBirth, userID, userPW, userLocation, disabilityType
 * @returns E0001 클라이언트 측 파라미터 오류
 * @returns E0002 아이디 최대 길이 초과
 * @returns E0003 비밀번호 최대 길이 초과
 * @returns E0004 회원가입 실패
 * @returns S0001 사용 가능
 */
const bcrypt = require('bcrypt');

router.post('/signup', async(req, res) => {
    try{
        const{ userName, phone, userBirth, userID, userPW, userLocation, disabilityType} = req.body;
        const exist = db.get(phone);

        // 이미 존재하는 폰번호 -> 가입 실패 
        if(exist){
            res.status(400).send({ result : 'E0001'});
            return;
        }
        if(!userName || !phone || !userBirth || !userID || !userPW || !userLocation || !disabilityType){
            return res.status(400).send({ result : 'E0001' });
        }
        if(userID.length > 20){
            return res.status(400).send({ result : 'E0002'});
        }
        if(userPW.length > 20){
            return res.status(400).send({ result : 'E0003'});
        }
        /* 비밀번호 암호화, salt도입 가능
        bcrypt사용시 해싱된 비밀번호 확인 부분 작성해야함
        const hashPW = await bcrypt.hash(userPW, 10);
        */
        
        // db 저장 프로시저 호출
        const result = await db.doCallProcedure('CALL ADD_USER(?, ?, ?, ?, ?, ?, ?)',
            [userName, phone, userBirth, userID, hashedPW, userLocation, disabilityType]
        );
        // 201 Created 요청성공, 새로운 리소스 생성 
        if(result.affectedRows > 0){
            return res.status(201).send({ result : 'S0001'});
        }
        // 회원가입 실패 
        else{
            return res.status(500).send({ result : 'E0004'})
        }
    } catch(error){
        return res.status
    }
});

module.exports = router;