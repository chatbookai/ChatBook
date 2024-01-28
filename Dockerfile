FROM node:18
RUN git clone https://github.com/chatbookai/ChatBook.git
WORKDIR "ChatBook"
RUN npm i 
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]