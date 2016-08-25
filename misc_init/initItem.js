/**
 * Created by yk on 2016/8/9.
 */
const LimitRequestUtil = require('../service/LimitRequestUtil')
let req = new LimitRequestUtil({concurrence_size: 10})
const fs = require('fs')

const itemUrlPrefix =  "http://cdn.dota2.com.cn/apps/dota2/images/items/"
const itemBriefsFile = "../conf/itemBriefs.json"
const itemInfos = require("../conf/itemOriginalData.json").result.items
let itemBriefs = {}
function initItemIcon() {
    console.log(itemInfos.length)
    for (let i = 0; i < itemInfos.length; i++) {
        let item = itemInfos[i]
        //http://cdn.dota2.com.cn/apps/dota2/images/items/mithril_hammer_eg.png
        let fullUrl = itemUrlPrefix + item.name.replace("item_", "") + "_lg.png"
        /*req.submitDownTask(fullUrl, "/image/itemOriginal2/", () => {
            return "item_" + item.id + ".png"
        })*/
        let itemBrief = {
            id: item.id,
            name: item.localized_name,
            icon: "require('../common/images/item/item_" + item.id + ".png')"
        }
        itemBriefs[item.id] = itemBrief
    }
    fs.writeFile(itemBriefsFile, JSON.stringify(itemBriefs))
}
initItemIcon()