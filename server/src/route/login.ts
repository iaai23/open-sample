import { SECRET_KEY } from '../index';

const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('../front');
});

//ログイン
router.post('/', (req, res) => {
    // 動作確認用に全ユーザーログインOK
    const payload = {
        user: req.body.user
    };
    const option = {
        expiresIn: '1m'
    };
    const token = jwt.sign(payload, SECRET_KEY, option);
    res.json({
        message: "create token",
        token: token
    });
});

export default router;
