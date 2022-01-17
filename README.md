# 小链家

链家二手房成交数据展示 web 端

## 关于小链家

这是一个链家二手房交易记录的汇总网站，数据大多收集自 [链家网](www.lianjia.com) 。

网站依靠一些图表工具，直观的展示任意城市、区县、街区、小区的成交记录和价格变动曲线。

我开发它的目的是为计划买房的人提供更直观的价格参考。

体验网址：[小链家](https://house.fengxiuge.top)

体验账号：xhh

体验密码：123789

### branch 

master：该分支是最原始的、前后分离项目的分支。

service-unify：该分支是专门给前后不分离的项目用的分支，其对应的后端代码仓库地址为：[house-viewer](https://github.com/yakunyue/house-viewer)

cloud-branch：该分支对应的后端是基于 Spring Gateway 网关构建的一个微服务系统。

这三个分支只在 api 加解密和签名方式上有些差别，页面内容基本相同。

前端项目地址：https://github.com/yakunyue/house-web

后端项目已开放，项目地址：https://github.com/yakunyue/house-viewer

如果你有兴趣一起开发可以私信我，或者加我的微信：eGlhb2h1aWh1aWFuZHl5aw==（需base64解码）

## 部署教程

这里有详细的[单体服务部署教程](https://github.com/yakunyue/house-viewer)

## TODO

* 登录页背景图片自适应

* 增加区县页面改成弹窗

* 增加成交记录查询页面

* 移动端适配

## 已完成

* ~~成交量热力图~~

* ~~API加解密~~
