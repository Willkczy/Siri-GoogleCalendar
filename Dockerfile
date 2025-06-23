# 使用官方 Node.js LTS 映像
FROM node:22.1.0

# 設定工作目錄
WORKDIR /app

# 安裝依賴
COPY package*.json ./
RUN npm install

# 複製其他檔案
COPY . .

# 設定啟動指令
CMD ["npm", "start"]
