// routes/chat.js - API chatbox AI dùng Groq (miễn phí)
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// POST /api/chat - Gửi tin nhắn tới Groq AI
router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'Thiếu nội dung tin nhắn!' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: `Bạn là chuyên gia tư vấn gym và thể hình cá nhân.
Hãy trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.
Bạn có thể giúp người dùng:
- Gợi ý bài tập theo nhóm cơ (ngực, lưng, vai, tay, chân, bụng)
- Lên lịch tập theo tuần phù hợp với mục tiêu
- Hướng dẫn kỹ thuật thực hiện bài tập đúng cách
- Tư vấn mức tạ phù hợp cho người mới và người có kinh nghiệm
- Giải đáp thắc mắc về dinh dưỡng và phục hồi
Hãy luôn nhiệt tình, động viên và đưa ra lời khuyên an toàn.`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Lỗi từ Groq AI');
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Lỗi chat AI:', err.message);
    res.status(500).json({ error: 'Không thể kết nối AI: ' + err.message });
  }
});

module.exports = router;