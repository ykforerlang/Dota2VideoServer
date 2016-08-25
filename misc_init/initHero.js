/**
 * Created by yk on 2016/8/9.
 */
const LimitRequestUtil = require('../service/LimitRequestUtil')
let req = new LimitRequestUtil({concurrence_size: 10})
const fs = require('fs')

let heroBriefs = {}
const heroesInfo = require("../conf/heroOriginalData.json").result.heroes //get by https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key=6515B089779D631CD61B8599622FE7FC&language=zh_cn
const heroBriefsFile = "../conf/heroBriefs.json"

const heroPrefix =  "http://cdn.dota2.com.cn/apps/dota2/images/heroes/"
function initHeroIcon() {
    for (let i = 0; i < heroesInfo.length; i++) {
        let hero = heroesInfo[i]
        let fullUrl = heroPrefix + hero.name.replace("npc_dota_hero_", "") + "_selection.png" // all picture is png format, eg is small
       /* req.submitDownTask(fullUrl, "/image/heroOriginal", () => {
            return "hero_" + hero.id + ".png"
        })*/

        let heroBrief = {
            id: hero.id,
            name: hero.localized_name,
            icon:"require('../common/images/hero/hero_" + hero.id + ".png')"
        }
        heroBriefs[hero.id] = heroBrief
    }
    fs.writeFile(heroBriefsFile, JSON.stringify(heroBriefs))
}
initHeroIcon()