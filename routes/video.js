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

router.get("/ykPage", (req, res) => {
    const {width, height, videoId} = req.query
    //TODO get src by videoId
    const video = videoDb.get('video')
        .find({videoId: parseInt(videoId)})
        .value()


    res.render('video', { width,
        height,
        src:video.videoRes,
    });
})

module.exports = router;