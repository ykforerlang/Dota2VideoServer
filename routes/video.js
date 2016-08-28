/**
 * Created by yk on 2016/8/26.
 */

"use strict";
const express = require('express')
const log4js = require('log4js')
const router = express.Router();
const {videoDb} = require('../service/db')

router.get("/list", (req, res) => {
    const {maxId, minId} = req.query

    const videos = videoDb.get('video')
        .filter(video => {
            if (maxId) {
                return video.videoId < maxId
            }
            if (minId) {
                return video.videoId > minId
            }
            return true
        })
        .take(50)
        .value()
    res.json(videos || [])
})
module.exports = router;