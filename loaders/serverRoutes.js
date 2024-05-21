const express = require(`express`);
const userRoutes = require('../domain/user');



const router = express.Router();

/**
 * 로그인, 
 * 회원가입, 
 * 아이디 찾기, 
 * 비밀번호 초기화, 
 * 사용자 관리 CRUD
 */
router.use(`/user`, userRoutes);

module.exports = router;