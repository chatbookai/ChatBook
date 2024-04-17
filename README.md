# ChatBook

主要提供一站式的AI服务, 包含基础AI对话, AI角色代理, AI客服, AI知识库, AI生成思维导图, AI生成PPTX等功能; 可自由定义AI工作流程, 从而可以应对更加复杂的业务场景.

主要功能:
```
    1 基础AI对话: 无需每个用户去开通各通AI模型的会员,由单位开通一次,即可给单位内用户使用.

    2 AI角色代理: Ai的角色代理,可以设置不同的角色进行专业的问答服务.

    3 AI客服: 智能化的AI客户服务,连接企业自身知识库,进行专业问答,同时提供表单收集数据功能.

    4 AI知识库: 使用企业自己数据进行投喂,然后进行问答.

    5 AI生成思维导图: 提供AI生成思维导图的功能.
    
    6 AI生成PPTX: 提供AI生成PPTX的功能.
```


## Vercel部署前端,后端在chatbookai.net,适用于简单体验

[![][vercel-deploy-shield]][vercel-deploy-link]

## 编译安装,适用于需要做二次开发
```
git clone https://github.com/chatbookai/ChatBook.git
启动前端项目:
    cd ChatBook
    npm install
    npm run dev
    然后访问　http://127.0.0.1:3000
启动后端项目:
    使用另外一个CMD窗口,进入到ChatBook目录的express目录下面,因为是前后端在一个仓库,但是两个项目,需要额外再执行一次npm install,命令如下:
    cd ChatBook\express
    npm install
    npm run express
    后端API就可以访问了, http://127.0.0.1:1988

```
后端使用serverless function, 数据目录是在安装目录的./data下面.

## 使用流程
```
管理员: 
 1 设置OPENAI KEY或是其它模型的KEY,管理知识库,并且给每个知识库配置KEY等信息
 2 管理普通用户信息
 3 自行注册的用户,需要管理员审核以后,就可以使用AI对话模型和知识库模型
 4 新用户可以自己注册,或是由管理员建立

普通用户: 
 1 可以直接使用AI对话模型和知识库模型
 2 自行注册

默认管理员
 用户名: chatbook-admin@gmail.com
 密码: 123456aA

默认普通用户
 用户名: chatbook-user@gmail.com
 密码: 123456aA

```

## 技术架构
    1 LLM:  Langchain, Pinecone, OpenAi, Gemini, Baidu Wenxin, 后续会持续集成其它模型
    2 后端: Node Express
    3 前端: React, NextJS, MUI

## 🚀 交流群组
    QQ群: 186411255

# 📄 版权声明/开源协议
- 本项目发行协议: [AGPL-3.0 License]

# 🧮 商业用途
- 开源商用: 无需联系,可以直接使用,需要在您官网页面底部增加您的开源库的URL(根据开源协议你需要公开你的源代码),GPL协议授权你可以修改代码,并共享你修改以后的代码,但没有授权你可以修改版权信息,所以版权信息不能修改.
- 闭源商用: 需要联系,额外取得商业授权,根据商业授权协议的内容,来决定你是否可以合法的修改版权信息.
- 宣传折扣: 如果你愿意推广和宣传本项目,可以让你的朋友们来给本项目点赞(STAR),每一个STAR在你购买商业版本授权的时候可抵扣一定的金额,最多可抵扣50%.如果不需要购买商业授权,则无需这样做.
- 技术服务: 可选项目,每年支付一次,主要用于软件二次开发商做二次开发的时候的技术咨询和服务,其它业务场景则不需要支付此费用,具体请咨询.
- 额外说明: 本系统指的是计算机软件代码,系统里面带的模板并不是开源项目的一部分.虽然系统会自带四套模板供大家免费使用,但更多模板需要购买模板的授权.

<!-- LINK GROUP -->
[vercel-deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchatbookai%2FChatBook&project-name=ChatBook&repository-name=ChatBook
[vercel-deploy-shield]: https://vercel.com/button
