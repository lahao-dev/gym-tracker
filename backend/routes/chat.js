// routes/chat.js - API chatbox AI dùng Groq + YouTube miễn phí
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// POST /api/chat
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

QUAN TRỌNG: Khi người dùng hỏi về một bài tập cụ thể, ở cuối câu trả lời hãy thêm dòng này:
[VIDEO:tên_bài_tập_tiếng_anh]
Ví dụ: [VIDEO:bench press], [VIDEO:squat], [VIDEO:deadlift]
Chỉ thêm tag VIDEO khi người dùng hỏi về 1 bài tập cụ thể, không thêm khi hỏi chung chung.`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Lỗi từ Groq AI');

    let reply = data.choices[0].message.content;

    // Trích xuất tên bài tập từ tag [VIDEO:...]
    const videoMatch = reply.match(/\[VIDEO:([^\]]+)\]/i);
    let videoKeyword = null;

    if (videoMatch) {
      videoKeyword = videoMatch[1].trim();
      // Xóa tag VIDEO khỏi reply text
      reply = reply.replace(/\[VIDEO:[^\]]+\]/i, '').trim();
    }

    res.json({
      reply,
      videoKeyword // Gửi keyword về frontend để tạo iframe
    });

  } catch (err) {
    console.error('Lỗi chat AI:', err.message);
    res.status(500).json({ error: 'Không thể kết nối AI: ' + err.message });
  }
});

module.exports = router;