/**
 * Created by yk on 2016/8/26.
 */

"use strict";
const express = require('express')
const log4js = require('log4js')
const router = express.Router();
const {videoDb} = require('../service/db')

router.get("/list", (req, res) => {
    const {maxId} = req.query

})
module.exports = router;