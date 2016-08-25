/**
 * Created by yk on 2016/7/12.
 */

const exec = require('child_process').exec

//resize league icon to small
// jpg is smaller and  resize to 80 x60
//convert 4649.png -resize 80x60  4649small2.jpg
const leagueBriefs = require('../conf/leagueBriefs.json')
const leagueInfos = leagueBriefs.professional.concat(leagueBriefs.premium, leagueBriefs.amateur)
function resizeLeague() {
    for (let i = 0; i< leagueInfos.length; i++) {
        let leagueid = leagueInfos[i].id
        let cmd = `convert D:\\image\\leagueOriginal\\${leagueid}.png -resize 80x60 D:\\image\\league\\${leagueid}.jpg`
        console.log(cmd)

        exec(cmd, function(err,stdout,stderr){
            if(err) {
                console.log('league:', leagueid , 'error:', stderr);
            } else {
                // do nothing
            }
        })
    }
}
resizeLeague()



const teamBriefs = require("../conf/teamBriefs.json")
function resizeTeam() {
    for (let key in teamBriefs) {
        let teamId = key
        let cmd = `convert D:\\image\\teamOriginal\\${teamId}.png -resize 80x60 D:\\image\\team\\${teamId}.jpg`

        exec(cmd, function(err,stdout,stderr){
            if(err) {
                console.log('teamId:', key , 'error:', stderr);
            } else {
                // do nothing
            }
        })
    }
}
resizeTeam()
