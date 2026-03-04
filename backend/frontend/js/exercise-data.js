// exercises-data.js - Dữ liệu thư viện bài tập

const EXERCISES_DATA = {
  "Ngực": [
    {
      id: "bench-press",
      name: "Bench Press (Đẩy Tạ Nằm)",
      muscle: "Ngực giữa, Vai trước, Tay sau",
      difficulty: "Trung bình",
      equipment: "Tạ đòn, Ghế tập",
      youtubeId: "SCVCLChPQFY",
      steps: [
        "Nằm ngửa trên ghế, lưng thẳng, chân chạm sàn.",
        "Tay cầm tạ rộng hơn vai một chút (ngón tay cái quấn quanh tạ).",
        "Hạ tạ chậm xuống ngực dưới, khuỷu tay tạo góc 45–75°.",
        "Đẩy tạ lên thẳng, duỗi hoàn toàn nhưng không khóa khuỷu.",
        "Thở ra khi đẩy lên, hít vào khi hạ xuống."
      ],
      tips: [
        "Không để lưng dưới cong quá mức.",
        "Không nảy tạ lên từ ngực.",
        "Luôn có người bảo hộ khi tập nặng.",
        "Giữ vai ép xuống ghế suốt động tác."
      ]
    },
    {
      id: "incline-bench",
      name: "Incline Bench Press (Đẩy Dốc Lên)",
      muscle: "Ngực trên, Vai trước",
      difficulty: "Trung bình",
      equipment: "Tạ đòn hoặc tạ đơn, Ghế dốc 30–45°",
      youtubeId: "DbFgADa2PL8",
      steps: [
        "Điều chỉnh ghế nghiêng 30–45 độ.",
        "Nằm lên ghế, lưng tựa hoàn toàn vào đệm.",
        "Cầm tạ rộng hơn vai, hạ xuống ngang ngực trên (gần xương đòn).",
        "Đẩy tạ lên theo đường thẳng đứng.",
        "Kiểm soát tốc độ khi hạ xuống (2–3 giây)."
      ],
      tips: [
        "Góc ghế không nên quá 45° vì sẽ chuyển lực sang vai.",
        "Giữ cổ tay thẳng, không bẻ cong.",
        "Siết chặt cơ ngực ở đỉnh động tác."
      ]
    },
    {
      id: "dumbbell-flye",
      name: "Dumbbell Flye (Chim Bay Tạ Đơn)",
      muscle: "Ngực giữa, Ngực ngoài",
      difficulty: "Dễ",
      equipment: "Tạ đơn, Ghế phẳng",
      youtubeId: "eozdVDA78K0",
      steps: [
        "Nằm trên ghế phẳng, cầm 2 tạ đơn hướng lên trần.",
        "Hơi cong khuỷu tay (không thẳng hoàn toàn).",
        "Từ từ mở rộng hai tay sang hai bên cho đến khi cảm nhận căng ngực.",
        "Khép tay lại như đang ôm một cái cây lớn.",
        "Siết ngực ở đỉnh động tác."
      ],
      tips: [
        "Đây là bài cô lập — dùng tạ nhẹ hơn bench press.",
        "Không hạ tay xuống quá thấp gây chấn thương vai.",
        "Tập trung cảm nhận căng cơ ngực, không phải sức mạnh."
      ]
    },
    {
      id: "push-up",
      name: "Push Up (Chống Đẩy)",
      muscle: "Ngực, Vai trước, Tay sau",
      difficulty: "Dễ",
      equipment: "Không cần dụng cụ",
      youtubeId: "IODxDxX7oi4",
      steps: [
        "Tư thế plank: tay rộng hơn vai, người thẳng từ đầu đến gót.",
        "Hạ người xuống cho đến khi ngực gần chạm sàn.",
        "Đẩy người lên về vị trí ban đầu.",
        "Giữ core cứng suốt động tác.",
        "Thở ra khi đẩy lên."
      ],
      tips: [
        "Không để hông xệ xuống hoặc nhô lên.",
        "Tay rộng hơn → tập ngực nhiều hơn. Tay hẹp → tập tay sau nhiều hơn.",
        "Biến thể nâng cao: chân đặt lên ghế (incline push up)."
      ]
    }
  ],
  "Lưng": [
    {
      id: "deadlift",
      name: "Deadlift (Kéo Đất)",
      muscle: "Lưng dưới, Mông, Đùi sau, Bẫy",
      difficulty: "Khó",
      equipment: "Tạ đòn",
      youtubeId: "op9kVnSso6Q",
      steps: [
        "Đứng rộng bằng vai, ngón chân hướng ra ngoài nhẹ.",
        "Tạ đặt sát ống chân, tay cầm rộng hơn chân một chút.",
        "Hông hạ xuống, lưng thẳng, ngực mở ra phía trước.",
        "Đẩy sàn ra sau bằng gót chân, kéo tạ lên dọc theo ống chân.",
        "Đứng thẳng hoàn toàn, siết mông ở đỉnh. Hạ tạ kiểm soát."
      ],
      tips: [
        "Lưng PHẢI thẳng — đây là nguyên tắc quan trọng nhất.",
        "Tạ phải luôn tiếp xúc hoặc rất gần ống chân.",
        "Không giật tạ lên — lực phải đều và kiểm soát.",
        "Đeo đai lưng khi tập nặng."
      ]
    },
    {
      id: "pull-up",
      name: "Pull Up (Xà Đơn)",
      muscle: "Lưng rộng, Tay nhị đầu, Tay sau",
      difficulty: "Khó",
      equipment: "Xà đơn",
      youtubeId: "eGo4IYlbE5g",
      steps: [
        "Cầm xà rộng hơn vai, lòng bàn tay hướng ra ngoài.",
        "Duỗi hoàn toàn, vai nhô lên tai (dead hang).",
        "Kéo khuỷu tay xuống và ra sau, cằm vượt qua xà.",
        "Hạ người từ từ về vị trí ban đầu (3–4 giây).",
        "Tránh đung đưa người để lấy đà."
      ],
      tips: [
        "Nếu chưa đủ sức, dùng elastic band hỗ trợ.",
        "Tập trung vào việc kéo khuỷu tay xuống, không phải kéo tay.",
        "Chin up (lòng bàn tay hướng vào) dễ hơn và tập tay nhị đầu nhiều hơn."
      ]
    },
    {
      id: "lat-pulldown",
      name: "Lat Pulldown (Kéo Cáp Lưng)",
      muscle: "Lưng rộng, Tay nhị đầu",
      difficulty: "Dễ",
      equipment: "Máy kéo cáp",
      youtubeId: "CAwf7n6Luuc",
      steps: [
        "Ngồi vào máy, đùi kẹp vào đệm cố định.",
        "Cầm tay cầm rộng hơn vai, lòng bàn tay hướng ra ngoài.",
        "Ngả người ra sau nhẹ (~15°), ngực mở ra.",
        "Kéo xuống đến cằm hoặc ngực trên, khuỷu tay hướng xuống.",
        "Từ từ thả lên về vị trí ban đầu."
      ],
      tips: [
        "Không lắc người để kéo — đây là lỗi phổ biến nhất.",
        "Hóp bụng, giữ lưng thẳng.",
        "Cảm nhận lưng rộng căng ra khi thả về."
      ]
    },
    {
      id: "bent-over-row",
      name: "Bent Over Row (Kéo Tạ Cúi)",
      muscle: "Lưng giữa, Lưng rộng, Tay nhị đầu",
      difficulty: "Trung bình",
      equipment: "Tạ đòn hoặc tạ đơn",
      youtubeId: "vT2GjY_Umpw",
      steps: [
        "Đứng rộng bằng vai, cúi người về trước ~45°, lưng thẳng.",
        "Cầm tạ rộng hơn vai (có thể dùng tay sấp hoặc ngửa).",
        "Kéo tạ lên hướng về bụng/ngực dưới, khuỷu tay kéo ra sau.",
        "Siết lưng ở đỉnh rồi hạ tạ xuống kiểm soát.",
        "Lưng giữ thẳng suốt động tác."
      ],
      tips: [
        "Không dùng đà từ lưng dưới để kéo lên.",
        "Tưởng tượng đang cố 'bẻ gãy' thanh tạ để kích hoạt lưng.",
        "Khuỷu tay nên cao hơn lưng ở đỉnh động tác."
      ]
    }
  ],
  "Vai": [
    {
      id: "overhead-press",
      name: "Overhead Press (Đẩy Vai)",
      muscle: "Vai giữa, Vai trước, Tay sau",
      difficulty: "Trung bình",
      equipment: "Tạ đòn hoặc tạ đơn",
      youtubeId: "2yjwXTZQDDI",
      steps: [
        "Đứng (hoặc ngồi), cầm tạ ngang vai, khuỷu tay hướng về trước.",
        "Đẩy tạ thẳng lên trên đầu, duỗi tay hoàn toàn.",
        "Hạ tạ về ngang vai một cách kiểm soát.",
        "Giữ core cứng để bảo vệ lưng dưới.",
        "Tránh ngửa lưng ra sau khi đẩy."
      ],
      tips: [
        "Đứng giúp tập thêm core, ngồi giúp cô lập vai hơn.",
        "Không khóa khuỷu tay ở đỉnh.",
        "Đẩy tạ ra phía sau đầu nhẹ ở đỉnh để giữ thăng bằng."
      ]
    },
    {
      id: "lateral-raise",
      name: "Lateral Raise (Nâng Tạ Ngang)",
      muscle: "Vai giữa",
      difficulty: "Dễ",
      equipment: "Tạ đơn",
      youtubeId: "3VcKaXpzqRo",
      steps: [
        "Đứng thẳng, cầm 2 tạ đơn hai bên hông.",
        "Nâng tay lên sang hai bên đến ngang vai (không cao hơn).",
        "Cổ tay hơi xoay xuống (ngón út cao hơn ngón cái).",
        "Hạ xuống từ từ (3 giây).",
        "Không lắc người hay nhún vai để lấy đà."
      ],
      tips: [
        "Dùng tạ nhẹ — đây là bài cô lập, không phải bài sức mạnh.",
        "Hạ xuống chậm quan trọng hơn nâng lên nhanh.",
        "Tập cáp thay tạ đơn giúp duy trì sức căng tốt hơn."
      ]
    },
    {
      id: "face-pull",
      name: "Face Pull (Kéo Cáp Mặt)",
      muscle: "Vai sau, Bẫy giữa, Xoay ngoài vai",
      difficulty: "Dễ",
      equipment: "Máy cáp",
      youtubeId: "rep-qVOkqgk",
      steps: [
        "Chỉnh cáp ngang mặt, gắn dây thừng hai đầu.",
        "Cầm hai đầu dây, lòng bàn tay hướng xuống.",
        "Kéo dây về phía mặt, tách hai tay ra hai bên.",
        "Khuỷu tay ngang hoặc cao hơn vai.",
        "Siết vai sau và trả về kiểm soát."
      ],
      tips: [
        "Đây là bài thiết yếu để giữ sức khỏe vai — tập đều mỗi buổi.",
        "Không kéo xuống cổ — kéo thẳng về mặt.",
        "Dùng tạ nhẹ, rep cao (15–20 rep)."
      ]
    }
  ],
  "Tay": [
    {
      id: "barbell-curl",
      name: "Barbell Curl (Curl Tạ Đòn)",
      muscle: "Tay nhị đầu",
      difficulty: "Dễ",
      equipment: "Tạ đòn",
      youtubeId: "kwG2ipFRgfo",
      steps: [
        "Đứng thẳng, tay cầm tạ đòn rộng bằng vai, lòng bàn tay hướng lên.",
        "Khuỷu tay kẹp sát hông — đây là điểm cố định.",
        "Cuộn tạ lên đến ngực, siết nhị đầu ở đỉnh.",
        "Hạ xuống từ từ (3 giây) về vị trí ban đầu.",
        "Không lắc người để lấy đà."
      ],
      tips: [
        "Khuỷu tay KHÔNG được di chuyển về trước khi cuộn lên.",
        "Duỗi hoàn toàn ở dưới để tập đủ biên độ.",
        "EZ bar giảm áp lực cổ tay hơn thẳng bar."
      ]
    },
    {
      id: "tricep-pushdown",
      name: "Tricep Pushdown (Đẩy Cáp Tay Sau)",
      muscle: "Tay tam đầu",
      difficulty: "Dễ",
      equipment: "Máy cáp",
      youtubeId: "2-LAMcpzODU",
      steps: [
        "Đứng trước máy cáp cao, cầm thanh V hoặc thẳng.",
        "Khuỷu tay kẹp sát hông, không di chuyển.",
        "Đẩy xuống cho đến khi tay duỗi hoàn toàn.",
        "Siết tay sau ở đỉnh (tay thẳng).",
        "Trả về chậm, cảm nhận căng tay sau."
      ],
      tips: [
        "Người hơi cúi về trước để tập tốt hơn.",
        "Khuỷu tay là trục xoay — không để nó bật ra trước.",
        "Dùng dây thừng (rope) giúp tập được biên độ rộng hơn."
      ]
    },
    {
      id: "hammer-curl",
      name: "Hammer Curl",
      muscle: "Tay nhị đầu (đầu ngoài), Cẳng tay",
      difficulty: "Dễ",
      equipment: "Tạ đơn",
      youtubeId: "zC3nLlEvin4",
      steps: [
        "Đứng thẳng, cầm tạ đơn hai tay, ngón cái hướng lên (tư thế búa).",
        "Cuộn từng tay hoặc cả hai lên đến vai.",
        "Giữ cổ tay thẳng suốt động tác.",
        "Hạ xuống từ từ.",
        "Khuỷu tay cố định ở bên hông."
      ],
      tips: [
        "Grip búa giúp phát triển cẳng tay và đầu ngoài nhị đầu.",
        "Có thể thực hiện xen kẽ từng tay để tập trung hơn.",
        "Biên độ không cần rộng bằng curl thông thường."
      ]
    },
    {
      id: "skull-crusher",
      name: "Skull Crusher (Tạ Sau Đầu Nằm)",
      muscle: "Tay tam đầu",
      difficulty: "Trung bình",
      equipment: "Tạ đòn EZ hoặc tạ đơn, Ghế phẳng",
      youtubeId: "d_KZxkY_0cM",
      steps: [
        "Nằm trên ghế, cầm tạ EZ thẳng lên trên ngực.",
        "Giữ khuỷu tay cố định, hạ tạ xuống về phía trán.",
        "Dừng ngay trước khi tạ chạm trán.",
        "Đẩy lên về vị trí ban đầu bằng tay sau.",
        "Khuỷu tay không được xòe ra ngoài."
      ],
      tips: [
        "Đây là lý do có tên 'skull crusher' — tập PHẢI kiểm soát tốt.",
        "Dùng tạ nhẹ khi mới học.",
        "EZ bar thoải mái cổ tay hơn straight bar."
      ]
    }
  ],
  "Chân": [
    {
      id: "squat",
      name: "Squat (Ngồi Xổm Tạ)",
      muscle: "Đùi trước, Đùi sau, Mông, Lưng dưới",
      difficulty: "Khó",
      equipment: "Tạ đòn, Rack squat",
      youtubeId: "ultWZbUMPL8",
      steps: [
        "Đặt tạ đòn lên vai sau (low bar) hoặc vai trên (high bar).",
        "Đứng rộng hơn vai một chút, ngón chân hơi xoay ra ngoài.",
        "Hít sâu, căng bụng, ngồi xuống như ngồi vào ghế.",
        "Hạ xuống đến khi đùi song song sàn hoặc sâu hơn.",
        "Đẩy gót chân xuống sàn để đứng lên, giữ lưng thẳng."
      ],
      tips: [
        "Gối không được đổ vào trong — đẩy đầu gối ra ngoài theo ngón chân.",
        "Nhìn thẳng về trước, không nhìn lên hay nhìn xuống.",
        "Thở ra khi đứng lên, không thở khi đang hạ xuống.",
        "Luôn có người bảo hộ hoặc dùng safety bar."
      ]
    },
    {
      id: "leg-press",
      name: "Leg Press (Máy Đẩy Chân)",
      muscle: "Đùi trước, Mông, Đùi sau",
      difficulty: "Dễ",
      equipment: "Máy leg press",
      youtubeId: "IZxyjW7MPJQ",
      steps: [
        "Ngồi vào máy, đặt chân lên bàn đạp rộng bằng vai.",
        "Tháo chốt an toàn.",
        "Hạ bàn đạp xuống cho đến khi đầu gối gập 90°.",
        "Đẩy mạnh về vị trí ban đầu nhưng không khóa gối.",
        "Kiểm soát khi hạ xuống (không để tạ rơi tự do)."
      ],
      tips: [
        "Không để lưng dưới tách khỏi đệm — đây là dấu hiệu tạ quá nặng.",
        "Chân đặt cao hơn → tập mông nhiều hơn. Thấp hơn → tập đùi trước.",
        "Không khóa gối hoàn toàn ở đỉnh để tránh chấn thương."
      ]
    },
    {
      id: "romanian-deadlift",
      name: "Romanian Deadlift (RDL)",
      muscle: "Đùi sau, Mông, Lưng dưới",
      difficulty: "Trung bình",
      equipment: "Tạ đòn hoặc tạ đơn",
      youtubeId: "JCXUYuzwNrM",
      steps: [
        "Đứng thẳng cầm tạ trước đùi, bàn chân rộng bằng hông.",
        "Giữ tạ sát người, cúi người về trước bằng cách đẩy hông ra sau.",
        "Hạ tạ xuống đến giữa ống chân, cảm nhận đùi sau căng.",
        "Đẩy hông về trước để đứng thẳng lại.",
        "Siết mông ở đỉnh động tác."
      ],
      tips: [
        "Lưng phải thẳng — không cong lưng dưới.",
        "Khác với deadlift thường: gối gần như thẳng, không hạ hông.",
        "Đây là bài tốt nhất cho đùi sau và mông."
      ]
    },
    {
      id: "lunge",
      name: "Lunge (Bước Lunges)",
      muscle: "Đùi trước, Mông, Đùi sau",
      difficulty: "Dễ",
      equipment: "Không cần hoặc tạ đơn",
      youtubeId: "QOVaHwm-Q6U",
      steps: [
        "Đứng thẳng, tay thả dọc theo người (hoặc cầm tạ đơn).",
        "Bước một chân dài về trước.",
        "Hạ người xuống cho đến khi gối sau gần chạm sàn.",
        "Đẩy bằng gót chân trước để trở về.",
        "Đổi chân và lặp lại."
      ],
      tips: [
        "Gối trước không được vượt qua ngón chân.",
        "Thân người thẳng đứng, không cúi về trước.",
        "Biến thể: walking lunge (bước tiến), reverse lunge (bước lùi — dễ hơn cho người mới)."
      ]
    },
    {
      id: "calf-raise",
      name: "Calf Raise (Kiễng Gót)",
      muscle: "Bắp chân",
      difficulty: "Dễ",
      equipment: "Không cần hoặc máy",
      youtubeId: "gwLzBJYoWlI",
      steps: [
        "Đứng với gót chân trên cạnh bậc thang hoặc sàn phẳng.",
        "Kiễng gót lên cao nhất có thể, siết bắp chân.",
        "Hạ gót xuống thấp hơn mặt sàn (nếu dùng bậc thang) để tăng biên độ.",
        "Giữ ở đỉnh 1–2 giây.",
        "Thực hiện chậm, kiểm soát."
      ],
      tips: [
        "Bắp chân cần rep cao (15–25) vì là cơ chịu lực liên tục.",
        "Đứng thẳng chân tập gastrocnemius. Ngồi tập soleus.",
        "Tập đơn chân (single leg) hiệu quả hơn tập hai chân."
      ]
    }
  ],
  "Bụng": [
    {
      id: "plank",
      name: "Plank",
      muscle: "Core, Bụng thẳng, Lưng dưới",
      difficulty: "Dễ",
      equipment: "Không cần dụng cụ",
      youtubeId: "pSHjTRCQxIw",
      steps: [
        "Nằm sấp, chống khuỷu tay xuống sàn, khuỷu tay ngay dưới vai.",
        "Nâng người lên sao cho người thẳng từ đầu đến gót.",
        "Siết bụng, mông, và đùi.",
        "Giữ nguyên tư thế, thở đều.",
        "Không để hông xệ hoặc nhô lên."
      ],
      tips: [
        "Bắt đầu với 20–30 giây, tăng dần thời gian.",
        "Nhìn xuống sàn để cổ giữ thẳng.",
        "Cảm nhận bụng căng cứng như khi sắp bị đấm."
      ]
    },
    {
      id: "crunch",
      name: "Crunch (Gập Bụng)",
      muscle: "Bụng thẳng trên",
      difficulty: "Dễ",
      equipment: "Không cần dụng cụ",
      youtubeId: "Xyd_fa5zoEU",
      steps: [
        "Nằm ngửa, gối gập 90°, bàn chân đặt sàn.",
        "Tay khoanh trước ngực hoặc chạm nhẹ hai bên đầu.",
        "Gập người lên, cằm nhích về phía ngực.",
        "Siết bụng ở đỉnh, hạ xuống kiểm soát.",
        "Lưng dưới luôn chạm sàn."
      ],
      tips: [
        "Không kéo đầu bằng tay — chấn thương cổ.",
        "Biên độ ngắn nhưng siết chặt quan trọng hơn gập lớn.",
        "Thở ra khi gập lên, hít vào khi hạ xuống."
      ]
    },
    {
      id: "leg-raise",
      name: "Leg Raise (Nâng Chân)",
      muscle: "Bụng dưới, Hip flexor",
      difficulty: "Trung bình",
      equipment: "Không cần hoặc xà treo",
      youtubeId: "l4kQd9eWclE",
      steps: [
        "Nằm ngửa, tay đặt dọc người hoặc dưới mông.",
        "Giữ chân thẳng hoặc hơi gập gối.",
        "Nâng chân lên đến 90° so với sàn.",
        "Hạ chân xuống gần sàn nhưng không chạm.",
        "Lưng dưới luôn ép sàn — không được cong lên."
      ],
      tips: [
        "Nếu lưng cong lên khi hạ chân — chân chưa đủ mạnh, gập gối lại.",
        "Phiên bản treo xà khó hơn và hiệu quả hơn.",
        "Hít vào khi hạ chân, thở ra khi nâng lên."
      ]
    },
    {
      id: "russian-twist",
      name: "Russian Twist (Xoay Bụng)",
      muscle: "Bụng chéo, Core",
      difficulty: "Dễ",
      equipment: "Không cần hoặc tạ đơn",
      youtubeId: "wkD8rjkodUI",
      steps: [
        "Ngồi xuống sàn, gối gập 90°, người ngả về sau 45°.",
        "Nâng chân lên khỏi sàn (hoặc giữ chân chạm sàn nếu mới tập).",
        "Chắp tay hoặc cầm tạ trước ngực.",
        "Xoay người sang trái rồi sang phải, tay chạm gần sàn.",
        "Giữ lưng thẳng khi xoay, không cong tròn."
      ],
      tips: [
        "Xoay từ core, không xoay bằng vai.",
        "Chân càng thẳng và cao → càng khó.",
        "Thêm tạ khi đã làm được 20+ rep dễ dàng."
      ]
    }
  ],
  "Dãn Cơ": [
    {
      id: "chest-stretch",
      name: "Dãn Ngực (Doorway Stretch)",
      muscle: "Ngực, Vai trước",
      difficulty: "Dễ",
      equipment: "Khung cửa",
      youtubeId: "E7uQKC7R7_E",
      steps: [
        "Đứng trước khung cửa, tay đặt lên hai bên khung.",
        "Khuỷu tay gập 90°, cẳng tay tựa vào khung cửa.",
        "Bước một chân về trước, để trọng lượng người dồn về trước.",
        "Cảm nhận căng ở ngực và vai trước.",
        "Giữ 20–30 giây, thở đều."
      ],
      tips: [
        "Không ép quá mạnh — dãn cơ phải thoải mái.",
        "Tay cao hơn → dãn ngực trên. Ngang hơn → dãn ngực giữa.",
        "Nên tập sau buổi tập ngực hoặc đẩy."
      ]
    },
    {
      id: "hamstring-stretch",
      name: "Dãn Đùi Sau (Hamstring Stretch)",
      muscle: "Đùi sau",
      difficulty: "Dễ",
      equipment: "Không cần dụng cụ",
      youtubeId: "7h7SsxnczFY",
      steps: [
        "Ngồi xuống sàn, duỗi thẳng một chân, gập chân kia vào trong đùi.",
        "Với tay về phía bàn chân chân thẳng, giữ lưng thẳng.",
        "Cúi người về trước từ hông (không cong lưng).",
        "Giữ 20–30 giây khi cảm thấy căng đùi sau.",
        "Đổi chân và lặp lại."
      ],
      tips: [
        "Không cần chạm được ngón chân — miễn là cảm thấy căng đùi sau.",
        "Cúi từ hông, không cong lưng.",
        "Tập sau mỗi buổi chân hoặc deadlift."
      ]
    },
    {
      id: "quad-stretch",
      name: "Dãn Đùi Trước (Quad Stretch)",
      muscle: "Đùi trước",
      difficulty: "Dễ",
      equipment: "Không cần dụng cụ",
      youtubeId: "YyvWDMaL8kA",
      steps: [
        "Đứng thẳng, một tay vịn tường nếu cần.",
        "Gập gối, đưa bàn chân về phía mông.",
        "Cầm bàn chân bằng tay cùng bên.",
        "Giữ đầu gối chụm lại và thẳng đứng.",
        "Giữ 20–30 giây, đổi chân."
      ],
      tips: [
        "Giữ thân người thẳng — không cúi về trước.",
        "Đẩy hông về trước nhẹ để tăng cảm giác dãn.",
        "Tập sau buổi squat, lunge."
      ]
    },
    {
      id: "shoulder-stretch",
      name: "Dãn Vai (Cross Body Stretch)",
      muscle: "Vai sau, Bắp tay",
      difficulty: "Dễ",
      equipment: "Không cần dụng cụ",
      youtubeId: "0GVfvRSGeqw",
      steps: [
        "Đứng hoặc ngồi thẳng.",
        "Đưa một tay ngang qua người sang phía đối diện.",
        "Dùng tay kia kéo nhẹ cánh tay lại gần ngực.",
        "Giữ 20–30 giây, cảm nhận căng vai sau.",
        "Đổi tay."
      ],
      tips: [
        "Tay kéo cần đặt ở cẳng tay, không kéo ở khuỷu.",
        "Tập sau buổi tập vai hoặc kéo lưng.",
        "Có thể tập ở bất kỳ đâu, bất kỳ lúc nào."
      ]
    },
    {
      id: "hip-flexor-stretch",
      name: "Dãn Hip Flexor (Kneeling Lunge)",
      muscle: "Hip flexor, Đùi trước",
      difficulty: "Dễ",
      equipment: "Thảm tập",
      youtubeId: "PmxHMCMNKes",
      steps: [
        "Quỳ một gối xuống sàn, chân kia bước về trước (tư thế lunge).",
        "Thẳng lưng, đẩy hông về trước và xuống.",
        "Cảm nhận căng ở phần trước hông và đùi trên.",
        "Giữ 20–30 giây.",
        "Đổi bên."
      ],
      tips: [
        "Đặt thảm dưới gối để thoải mái hơn.",
        "Rất quan trọng cho người ngồi nhiều — hip flexor thường bị căng cứng.",
        "Có thể nâng tay lên cao để tăng mức độ dãn."
      ]
    },
    {
      id: "lat-stretch",
      name: "Dãn Lưng Rộng (Lat Stretch)",
      muscle: "Lưng rộng, Vai",
      difficulty: "Dễ",
      equipment: "Xà đơn hoặc khung cửa",
      youtubeId: "OUsqoO43y_E",
      steps: [
        "Cầm xà đơn hoặc khung cửa bằng một tay.",
        "Để người buông thõng, cảm nhận trọng lượng kéo xuống.",
        "Xoay hông nhẹ sang phía đối diện để tăng dãn.",
        "Giữ 20–30 giây.",
        "Đổi tay."
      ],
      tips: [
        "Thở đều, không nín thở.",
        "Tập sau buổi kéo lưng hoặc pull up.",
        "Biến thể: cúi người, hai tay cầm khung cửa, hông đẩy ra sau."
      ]
    },
    {
      id: "tricep-stretch",
      name: "Dãn Tay Sau (Overhead Tricep Stretch)",
      muscle: "Tay tam đầu",
      difficulty: "Dễ",
      equipment: "Không cần dụng cụ",
      youtubeId: "fyJJyQRGuvg",
      steps: [
        "Đứng hoặc ngồi thẳng.",
        "Nâng một tay lên, gập khuỷu sao cho bàn tay chạm sau lưng.",
        "Dùng tay kia nhẹ nhàng kéo khuỷu xuống.",
        "Giữ 20–30 giây.",
        "Đổi tay."
      ],
      tips: [
        "Không kéo quá mạnh.",
        "Tập sau các bài đẩy (bench press, push up, overhead press).",
        "Cũng giúp dãn vai."
      ]
    },
    {
      id: "lower-back-stretch",
      name: "Dãn Lưng Dưới (Child's Pose)",
      muscle: "Lưng dưới, Mông",
      difficulty: "Dễ",
      equipment: "Thảm tập",
      youtubeId: "qKAFBesGHtQ",
      steps: [
        "Quỳ gối xuống thảm, hai gối rộng bằng hông.",
        "Ngồi xuống về phía gót chân.",
        "Với tay về trước trên sàn, trán chạm thảm.",
        "Giữ nguyên, thở đều.",
        "Giữ 30–60 giây."
      ],
      tips: [
        "Đây là bài dãn tốt nhất cho lưng dưới.",
        "Tập sau deadlift, squat hoặc bất kỳ khi nào lưng mỏi.",
        "Tay với sang hai bên để dãn thêm lưng rộng."
      ]
    }
  ]
};