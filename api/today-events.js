const { google } = require('googleapis');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = async (req, res) => {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    // 🕒 正確抓台灣今天時間
    const now = dayjs().tz('Asia/Taipei');
    const startOfDay = now.startOf('day').toISOString();
    const endOfDay = now.endOf('day').toISOString();

    const response = await calendar.events.list({
      calendarId: 'willkczyhuang@gmail.com',
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;

    if (!events || events.length === 0) {
      return res.status(200).json({ message: '今天沒有會議 🎉' });
    }

    const titles = events.map(e => e.summary || '(無標題)');
    return res.status(200).json({ message: `今天有 ${titles.length} 個會議：${titles.join('、')}` });

  } catch (error) {
    console.error('❌ 錯誤:', error.message);
    return res.status(500).json({ error: '查詢行事曆時發生錯誤' });
  }
};
