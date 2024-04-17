FROM node:18
RUN git clone https://github.com/chatbookai/ChatBook.git
WORKDIR "ChatBook"
RUN npm i 
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]


## Docker安装,应用于非程序员
```
sudo docker pull chatbookai/chatbook:0.2

sudo docker run -p 8888:3000 chatbook:0.2

如何访问: http://127.0.0.1:3000 or http://youripaddress:8888

```
