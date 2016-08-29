/**
 * Created by yk on 2016/6/14.
 */

"use strict";
const express = require('express')
const log4js = require('log4js')
const router = express.Router();
const {matchDetailDb, videoDb} = require('../service/db')


router.get("/detail", (req, res) => {
    const {matchId} = req.query

    const index = parseInt(matchId) % 10
    console.log(index)
    const detail = matchDetailDb[index].get(matchId).value()
    const videoJson = videoDb.get('video').find({matchId:parseInt(matchId)}).value()

    res.json({
        detail,
        videoId: videoJson ? videoJson.videoId: ""
    })
})
module.exports = router;