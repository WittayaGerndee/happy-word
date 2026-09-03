/* ============================================================
   ข้อมูลคำศัพท์ — หมวดสัตว์ (MVP 10 คำ)
   ------------------------------------------------------------
   ทำไมเป็น .js ไม่ใช่ .json?
   เพราะ fetch() อ่านไฟล์ .json ไม่ได้เวลาเปิดแบบ file://
   (ดับเบิลคลิก index.html) การใช้ .js ทำให้ทดสอบในเครื่องได้
   ทันทีโดยไม่ต้องรันเซิร์ฟเวอร์ โครงสร้างข้อมูลเหมือน JSON ทุกอย่าง
   ============================================================ */

window.HWA_DATA = {
  category: "animals",
  titleEn: "Animals",
  titleTh: "สัตว์",
  emoji: "🐯",

  words: [
    { id: "dog",      english: "Dog",      thai: "สุนัข",   emoji: "🐶", sentence: "This is a dog.",       difficulty: 1 },
    { id: "cat",      english: "Cat",      thai: "แมว",    emoji: "🐱", sentence: "This is a cat.",       difficulty: 1 },
    { id: "bird",     english: "Bird",     thai: "นก",     emoji: "🐦", sentence: "This is a bird.",      difficulty: 1 },
    { id: "fish",     english: "Fish",     thai: "ปลา",    emoji: "🐟", sentence: "This is a fish.",      difficulty: 1 },
    { id: "frog",     english: "Frog",     thai: "กบ",     emoji: "🐸", sentence: "This is a frog.",      difficulty: 2 },
    { id: "monkey",   english: "Monkey",   thai: "ลิง",    emoji: "🐵", sentence: "This is a monkey.",    difficulty: 2 },
    { id: "rabbit",   english: "Rabbit",   thai: "กระต่าย", emoji: "🐰", sentence: "This is a rabbit.",    difficulty: 2 },
    { id: "tiger",    english: "Tiger",    thai: "เสือ",    emoji: "🐯", sentence: "This is a tiger.",     difficulty: 2 },
    { id: "lion",     english: "Lion",     thai: "สิงโต",   emoji: "🦁", sentence: "This is a lion.",      difficulty: 3 },
    { id: "elephant", english: "Elephant", thai: "ช้าง",    emoji: "🐘", sentence: "This is an elephant.", difficulty: 3 }
  ],

  /* สัตว์พิเศษ — ได้จากไข่ปริศนาเท่านั้น (Phase 3) */
  bonusAnimals: [
    { id: "panda",    english: "Panda",    thai: "แพนด้า",   emoji: "🐼" },
    { id: "fox",      english: "Fox",      thai: "จิ้งจอก",  emoji: "🦊" },
    { id: "koala",    english: "Koala",    thai: "โคอาลา",  emoji: "🐨" },
    { id: "penguin",  english: "Penguin",  thai: "เพนกวิน", emoji: "🐧" },
    { id: "owl",      english: "Owl",      thai: "นกฮูก",   emoji: "🦉" },
    { id: "turtle",   english: "Turtle",   thai: "เต่า",    emoji: "🐢" }
  ],

  /* คำพูดของ Bunny — สุ่มไม่ซ้ำติดกัน (Concept v2 ภาคผนวก B.2) */
  bunnyLines: {
    greet:      ["สวัสดีจ้า!", "ดีใจที่เจอหนู!", "มาเล่นกันเถอะ!", "หวัดดีจ้า มาเล่นกัน!"],
    invite:     ["อยากเล่นเกมกับ Bunny มั้ย?", "มาทายกันมั้ย?"],
    learn:      ["มาดูกันว่ามีใครบ้าง", "แตะรูปได้นะ", "ฟังเสียงด้วยนะ"],
    correct:    ["Yay! เก่งมาก!", "ใช่เลย!", "Wow! ถูกต้อง!", "หนูจำได้แล้วนี่นา!", "เยี่ยมไปเลย!", "Bunny ดีใจจัง!"],
    encourage:  ["เกือบแล้ว!", "ลองอีกทีนะ", "ไม่เป็นไรนะ ลองใหม่", "ฟังอีกทีนะ", "ใกล้แล้ว!"],
    hint:       ["ดูดี ๆ นะ", "Bunny ช่วยหน่อยนะ", "เหลือสองตัวแล้ว!"],
    showAnswer: ["อยู่นี่ไง!", "แตะตรงนี้สิ!", "ตัวนี้จ้า!"],
    idle:       ["ไม่รีบนะ", "Bunny รออยู่นะ", "ค่อย ๆ คิดนะ"],
    finish:     ["หนูทำได้ทุกข้อเลย!", "เก่งมากเลยวันนี้!", "Bunny ภูมิใจมาก!"],
    freeplay:   ["แตะสัตว์ดูสิ!", "ตัวไหนน่ารักที่สุด?", "แตะเล่นได้เรื่อย ๆ นะ"]
  }
};
