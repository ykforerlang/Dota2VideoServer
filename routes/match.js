/**
 * Created by yk on 2016/6/14.
 */

"use strict";
const express = require('express')
const log4js = require('log4js')
const router = express.Router();
const {matchDetailDb} = require('../service/db')


router.get("/detail", (req, res) => {
    const {matchId} = req.query

    const index = parseInt(matchId) % 10
    console.log(index)
    const detail = matchDetailDb[index].get(matchId).value()

    res.json({
        detail,
        videoRes: "<iframe height=498 width=510 src='http://player.youku.com/embed/XMTY4NDA5MjgwMA==' frameborder=0 'allowfullscreen'></iframe>"
    })
})

router.get("/video", (req, res) => {
    //TODO
    res.json("<iframe height=498 width=510 src='http://player.youku.com/embed/XMTY4NDA5MjgwMA==' frameborder=0 'allowfullscreen'></iframe>")
})

module.exports = router;