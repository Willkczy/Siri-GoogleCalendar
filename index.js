const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();
const port = 3000;

// 時區設定（你可以改成其他地區）
const TIMEZONE = 'Asia/Taipei';

app.get('/api/today-events', async (req, res) => {
  try {
    // 讀取憑證
    require('dotenv').config();
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    // 建立授權對象
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    // 計算今天起始與結束時間（當地時區）
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // 查詢事件
    const response = await calendar.events.list({
      calendarId: 'willkczyhuang@gmail.com',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;

    if (!events || events.length === 0) {
      return res.json({ message: '今天沒有會議 🎉' });
    }

    const titles = events.map(e => e.summary || '(無標題)');
    return res.json({ message: `今天有 ${titles.length} 個會議：${titles.join('、')}` });

  } catch (error) {
    console.error('❌ 錯誤:', error.message);
    return res.status(500).json({ error: '查詢行事曆時發生錯誤' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}/api/today-events`);
});
