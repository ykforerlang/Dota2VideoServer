/**
 * Created by yk on 2016/8/23.
 */
//http://r3.ykimg.com/0542040857B01A7E6A0A4A051B9753AE
// Wings vs DC Ti6 总决赛 Bo5 第四场
// <iframe height=498 width=510 src="http://player.youku.com/embed/XMTY4NDE0MTE3Mg==" frameborder=0 allowfullscreen></iframe>
// 2569610900
// 2016.8.14


const db = require('../service/db')
const videoDb = db.videoDb
videoDb.get('video').push({
    thumb:'http://r3.ykimg.com/0542040857B01A7E6A0A4A051B9753AE',
    title:'Wings vs DC Ti6 总决赛 Bo5 第四场',
    day:'2016年8月14',
    matchId:2569610900,
})
.value()