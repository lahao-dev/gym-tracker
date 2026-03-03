// routes/chat.js - API chatbox AI
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// POST /api/chat - Gửi tin nhắn tới Claude AI
router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'Thiếu nội dung tin nhắn!' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: `Bạn là chuyên gia tư vấn gym và thể hình cá nhân. 
Hãy trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.
Bạn có thể giúp người dùng:
- Gợi ý bài tập theo nhóm cơ (ngực, lưng, vai, tay, chân, bụng)
- Lên lịch tập theo tuần phù hợp với mục tiêu
- Hướng dẫn kỹ thuật thực hiện bài tập đúng cách
- Tư vấn mức tạ phù hợp cho người mới và người có kinh nghiệm
- Giải đáp thắc mắc về dinh dưỡng và phục hồi
Hãy luôn nhiệt tình, động viên và đưa ra lời khuyên an toàn.`,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Lỗi từ Claude AI');
    }

    res.json({ reply: data.content[0].text });
  } catch (err) {
    console.error('Lỗi chat AI:', err.message);
    res.status(500).json({ error: 'Không thể kết nối AI: ' + err.message });
  }
});

module.exports = router;