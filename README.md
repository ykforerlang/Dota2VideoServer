Dota2VideoServer
====
Dota2Video  app 服务端, 存储使用了<a href="https://github.com/typicode/lowdb">lowdb</a>。

DOTA2相关
---
###api：
league type: <br>
           IIRC Premium = money from ticket goes to prize pool<br>
           Pro = high prize pool tourney but no extra money to prize pool<br>
           Am = amateur = low prize pool tourney w/ no extra money to prize pool<br>
    steamId和accountId转化:STEAMID32 + 76561197960265728 = STEAMID64<br>
                            182331313 + 76561197960265728 = 76561198142597040      
######steam 接口
获取联赛列表：　http://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v1/?key={}&language=zh_cn<br>
根据dotaId获取比赛（筛选比较复杂） ：https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v001/?key={}&league_id=2339<br>
根据mathId 获取比赛详细信息： http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key={}&match_id=1022565334<br>
队伍信息:http://api.steampowered.com/IDOTA2Teams_570/GetTeamInfo/v1?key={}&league_id=4325<br>
英雄信息:https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key={}&language=zh_cn
###icon
#####联赛
http://api.steampowered.com/IEconItems_570/GetSchemaURL/v1<br>
https://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key={}&leagueid=2733<br>
https://api.steampowered.com/IEconDOTA2_570/GetItemIconPath/v1/?key=<>&format=json&iconname=subscriptions_sdl<br>
#####装备图标
https://api.steampowered.com/IEconDOTA2_570/GetGameItems/v1?key={}&language=zh_cn
http://cdn.dota2.com.cn/apps/dota2/images/items/mithril_hammer_lg.png
http://cdn.dota2.com.cn/apps/dota2/images/items/recipe_ward_dispenser_eg.png
#####英雄图标
https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key={}&language=zh_cn
http://cdn.dota2.com.cn/apps/dota2/images/heroes/sand_king_full.png
http://cdn.dota2.com.cn/apps/dota2/images/heroes/antimage_hphover.png
http://cdn.dota2.com.cn/apps/dota2/images/heroes/nyx_assassin_lg.png
http://cdn.dota2.com.cn/apps/dota2/images/heroes/nyx_assassin_sb.png
http://cdn.dota2.com.cn/apps/dota2/images/heroes/nyx_assassin_eg.png
http://cdn.dota2.com/apps/dota2/images/miniheroes/leshrac.png
#####技能图标
http://cdn.dota2.com/apps/dota2/images/abilities/sven_storm_bolt_hp1.png
http://cdn.dota2.com/apps/dota2/images/abilities/sven_storm_bolt_hp2.png
http://cdn.dota2.com/apps/dota2/images/abilities/sven_storm_bolt_lg.png
#####队伍
http://www.dotamax.com/match/tour_famous_team_list/?league_id=&skill=&ladder=&p=6
https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v1?key={}
https://api.steampowered.com/IDOTA2Teams_570/GetTeamInfo/v1?key={}&team_id=726228
http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1/?key={}&appid=570&ugcid=
http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1/?key={}&appid=570&ugcid=35248220277958798
http://cloud-3.steamusercontent.com/ugc/35248220277958798/DF3CFDA0EF31EE74B6EA617342CB6B24CE402471/
#####队员
http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={}&steamids=76561197960435530
     
     


###参考资料：
---
1.express : http://expressjs.com/zh-cn/guide/using-middleware.html<br/>
2.es6 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions<br/>
3. lodash : https://lodash.com/docs<br>

###TODO
1.加入轮训






