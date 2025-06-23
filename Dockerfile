# 使用官方的 Node.js LTS 版本映像
FROM node:22.1.0

# 建立容器內的工作目錄 /app
WORKDIR /app

# 複製 package.json 與 package-lock.json（如有）到容器中
COPY package*.json ./

# 安裝 npm 套件
RUN npm install

# 複製專案中所有檔案到容器中（例如 index.js）
COPY . .

# 開放 3000 port（Express 預設）
EXPOSE 3000

# 啟動容器時執行的指令
CMD ["npm", "start"]
