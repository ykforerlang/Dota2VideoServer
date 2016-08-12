# dotaother
dota other not max



blog
1.react:https://www.kirupa.com/react/events_in_react.htm
     The reason is because components are wrappers for DOM elements.
     What does it even mean to listen for an event on a component?
     Once your component gets unwrapped into DOM elements, does the outer HTML element act as the thing you are listening for the event on?
     Is it some other element?
     How do you distinguish between listening for an event and declaring a prop you are listening for?
     (onClick as defined here is simply a property of that component.)

     There is no clear answer to any of those questions.
     It's too harsh to say that the solution is to simply not listen to events on components either.
     Fortunately, there is a workaround where we treat the event handler as a prop and pass it on to the component.
     Inside the component,
     we can then assign the event to a DOM element and set the event handler to the the value of the prop we just passed in.
     I realize that probably makes no sense, so let's walk through an example.

     http://browniefed.com/blog/getting-react-art-running-on-react-native/
     http://browniefed.com/blog/2015/10/14/react-native-morphing-svg-paths-with-react-art/
     https://github.com/skv-headless/react-native-scrollable-tab-view
     https://github.com/reactjs
     http://browniefed.com/react-native-animation-book/
     https://leanpub.com/programming-react-native
     http://wiki.jikexueyuan.com/project/react-native/scroll-view.html
     事件合成和事件委托： https://github.com/facebook/react/blob/master/docs/docs/03-interactivity-and-dynamic-uis.zh-CN.md
     first page: https://github.com/facebook/react-native/issues/1281
                 http://bbs.reactnative.cn/topic/1850/react-native-ios-%E8%AE%BE%E7%BD%AE-launchscreen


2.mongodb: https://mongodb.github.io/node-mongodb-native/api-generated/collection.html#find

3.express : http://expressjs.com/zh-cn/guide/using-middleware.html

4. es6 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions

5.dota2 api
   league: IIRC Premium = money from ticket goes to prize pool
           Pro = high prize pool tourney but no extra money to prize pool
           Am = amateur = low prize pool tourney w/ no extra money to prize pool
    steam 接口
    获取联赛列表：　http://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v1/?key={}&language=zh_cn
    根据dotaId获取比赛（筛选比较复杂） ：https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v001/?key={}&league_id=2339
    根据mathId 获取比赛详细信息： http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key={}&match_id=1022565334
    http://api.steampowered.com/IDOTA2Teams_570/GetTeamInfo/v1?key={}&league_id=4325
    steam 接口说明：
         http://steamwebapi.azurewebsites.net/
    100场： 1450688718 - 1450687298 = 1500s = 150 /6 = 25min


    //联赛
     http://api.steampowered.com/IEconItems_570/GetSchemaURL/v1
     https://api.steampowered.com/IEconDOTA2_570/GetTournamentPrizePool/v1?key={}&leagueid=2733
     https://api.steampowered.com/IEconDOTA2_570/GetItemIconPath/v1/?key=<>&format=json&iconname=subscriptions_sdl

    //装备图标
    https://api.steampowered.com/IEconDOTA2_570/GetGameItems/v1?key={}&language=zh_cn
    http://cdn.dota2.com.cn/apps/dota2/images/items/mithril_hammer_lg.png
    http://cdn.dota2.com.cn/apps/dota2/images/items/recipe_ward_dispenser_eg.png


    //英雄图标
    https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/?key={}&language=zh_cn
    http://cdn.dota2.com.cn/apps/dota2/images/heroes/sand_king_full.png
    http://cdn.dota2.com.cn/apps/dota2/images/heroes/antimage_hphover.png
    http://cdn.dota2.com.cn/apps/dota2/images/heroes/nyx_assassin_lg.png
    http://cdn.dota2.com.cn/apps/dota2/images/heroes/nyx_assassin_sb.png
    http://cdn.dota2.com.cn/apps/dota2/images/heroes/nyx_assassin_eg.png
    http://cdn.dota2.com/apps/dota2/images/miniheroes/leshrac.png

    //技能图标
    http://cdn.dota2.com/apps/dota2/images/abilities/sven_storm_bolt_hp1.png
    http://cdn.dota2.com/apps/dota2/images/abilities/sven_storm_bolt_hp2.png
    http://cdn.dota2.com/apps/dota2/images/abilities/sven_storm_bolt_lg.png

    // 队伍
    http://www.dotamax.com/match/tour_famous_team_list/?league_id=&skill=&ladder=&p=6
    https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v1?key={}
    https://api.steampowered.com/IDOTA2Teams_570/GetTeamInfo/v1?key={}&team_id=726228
    http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1/?key={}&appid=570&ugcid=
    http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1/?key={}&appid=570&ugcid=35248220277958798
    http://cloud-3.steamusercontent.com/ugc/35248220277958798/DF3CFDA0EF31EE74B6EA617342CB6B24CE402471/

    //个人
    http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={}&steamids=76561197960435530


   STEAMID32 + 76561197960265728 = STEAMID64
   182331313 + 76561197960265728 = 76561198142597040
   76561197960265728
           182331313
   76561198142597041


   6. 优酷视频/爬虫


   7 存储使用 lowdb



