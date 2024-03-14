# ChatBook

主要面向企业/政府/学校/其它组织,提供单位内部知识库管理和服务,使用企业私有数据进行投喂进行训练数据,然后提供给单位内用户使用.
使用场景:
    1 行业性垂直网站: 如房产领域,可以提供房产法规,交易,政策性咨询等服务.
    2 客户服务: 智能化的客户服务,可以帮企业节约客户服务成本.
    3 数据分析: 企业内部数据分析.
    4 基础AI对话: 无需每个用户去开通各通AI模型的会员,由单位开通一次,即可给单位内用户使用.

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

## Docker安装,应用于非程序员
```
sudo docker pull chatbookai/chatbook:0.2

sudo docker run -p 8888:3000 chatbook:0.2

如何访问: http://127.0.0.1:3000 or http://youripaddress:8888

```

## 默认用户名
```
管理员
用户名: chatbook-admin@gmail.com
密码: 123456aA

普通用户
用户名: chatbook-user@gmail.com
密码: 123456aA

```

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

```

## 支持模型
```
ChatGPT
Google Gemini
Baidu Wenxin
```

## 技术架构
    1 LLM:  Langchain, Pinecone, OPENAI, 后续会持续集成其它模型
    2 后端: NextJS, Severless
    3 前端: React, NextJS, MUI


<!-- LINK GROUP -->
[vercel-deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat-agents&project-name=lobe-chat-agents&repository-name=lobe-chat-agents
[vercel-deploy-shield]: https://vercel.com/button