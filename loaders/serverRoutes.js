const express = require(`express`);
const userRoutes = require('../domain/user');



const router = express.Router();

/**
 * 로그인 GET, 
 * 아이디 중복 검색 GET
 * 회원가입 , 
 */
router.use(`/user`, userRoutes);

module.exports = router;