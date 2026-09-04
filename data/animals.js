/* ============================================================
   ข้อมูลคำศัพท์ — หมวดสัตว์ (MVP 10 คำ)
   ------------------------------------------------------------
   ทำไมเป็น .js ไม่ใช่ .json?
   เพราะ fetch() อ่านไฟล์ .json ไม่ได้เวลาเปิดแบบ file://
   (ดับเบิลคลิก index.html) การใช้ .js ทำให้ทดสอบในเครื่องได้
   ทันทีโดยไม่ต้องรันเซิร์ฟเวอร์ โครงสร้างข้อมูลเหมือน JSON ทุกอย่าง

   field `img` = ภาพจริงที่ตัดจากโปสเตอร์ใน uploads/ (assets/img/<img>.png)
   ถ้าไม่มี `img` ระบบจะถอยไปใช้ emoji ให้เอง
   ============================================================ */

window.HWA_DATA = {
  category: "animals",
  titleEn: "Animals",
  titleTh: "สัตว์",
  emoji: "🐯",

  words: [
    { id: "dog",      english: "Dog",      thai: "สุนัข",   emoji: "🐶", img: "animals/dog",      color: "brown",  sentence: "This is a dog.",       difficulty: 1 },
    { id: "cat",      english: "Cat",      thai: "แมว",    emoji: "🐱", img: "animals/cat",      color: "white",  sentence: "This is a cat.",       difficulty: 1 },
    { id: "bird",     english: "Bird",     thai: "นก",     emoji: "🐦", img: "animals/bird",     color: "blue",   sentence: "This is a bird.",      difficulty: 1 },
    { id: "fish",     english: "Fish",     thai: "ปลา",    emoji: "🐟", img: "animals/fish",     color: "orange", sentence: "This is a fish.",      difficulty: 1 },
    { id: "frog",     english: "Frog",     thai: "กบ",     emoji: "🐸", img: "animals/frog",     color: "green",  sentence: "This is a frog.",      difficulty: 2 },
    { id: "monkey",   english: "Monkey",   thai: "ลิง",    emoji: "🐵", img: "animals/monkey",   color: "brown",  sentence: "This is a monkey.",    difficulty: 2 },
    { id: "rabbit",   english: "Rabbit",   thai: "กระต่าย", emoji: "🐰", img: "animals/rabbit",   color: "white",  sentence: "This is a rabbit.",    difficulty: 2 },
    { id: "tiger",    english: "Tiger",    thai: "เสือ",    emoji: "🐯", img: "animals/tiger",    color: "orange", sentence: "This is a tiger.",     difficulty: 2 },
    { id: "lion",     english: "Lion",     thai: "สิงโต",   emoji: "🦁", img: "animals/lion",     color: "yellow", sentence: "This is a lion.",      difficulty: 3 },
    { id: "elephant", english: "Elephant", thai: "ช้าง",    emoji: "🐘", img: "animals/elephant",                 sentence: "This is an elephant.", difficulty: 3 }
  ],

  /* สัตว์พิเศษ — ได้จากไข่ปริศนาเท่านั้น (Phase 3) */
  bonusAnimals: [
    { id: "panda",    english: "Panda",    thai: "แพนด้า",   emoji: "🐼", img: "animals/panda"                    },
    { id: "fox",      english: "Fox",      thai: "จิ้งจอก",  emoji: "🦊", img: "animals/fox",      color: "orange" },
    { id: "bear",     english: "Bear",     thai: "หมี",     emoji: "🐻", img: "animals/bear",     color: "brown"  },
    { id: "dolphin",  english: "Dolphin",  thai: "โลมา",    emoji: "🐬", img: "animals/dolphin",  color: "blue"   },
    { id: "owl",      english: "Owl",      thai: "นกฮูก",   emoji: "🦉", img: "animals/owl",      color: "brown"  },
    { id: "turtle",   english: "Turtle",   thai: "เต่า",    emoji: "🐢", img: "animals/turtle",   color: "green"  }
  ],

  /* คลังสัตว์เพิ่มเติม — ใช้ในเกมจับคู่/ต่อภาพ/จำอะไรหายไป
     ไม่เข้าระบบ Smart Review เพื่อไม่ให้คำศัพท์หลักเจือจาง */
  extraAnimals: [
    { id: "pig",       english: "Pig",       thai: "หมู",       emoji: "🐷", img: "animals/pig",       color: "pink"   },
    { id: "cow",       english: "Cow",       thai: "วัว",       emoji: "🐮", img: "animals/cow",       color: "white"  },
    { id: "horse",     english: "Horse",     thai: "ม้า",       emoji: "🐴", img: "animals/horse",     color: "brown"  },
    { id: "sheep",     english: "Sheep",     thai: "แกะ",       emoji: "🐑", img: "animals/sheep",     color: "white"  },
    { id: "goat",      english: "Goat",      thai: "แพะ",       emoji: "🐐", img: "animals/goat",      color: "white"  },
    { id: "chicken",   english: "Chicken",   thai: "ไก่",       emoji: "🐔", img: "animals/chicken",   color: "white"  },
    { id: "duck",      english: "Duck",      thai: "เป็ด",      emoji: "🦆", img: "animals/duck",      color: "yellow" },
    { id: "giraffe",   english: "Giraffe",   thai: "ยีราฟ",     emoji: "🦒", img: "animals/giraffe",   color: "yellow" },
    { id: "zebra",     english: "Zebra",     thai: "ม้าลาย",    emoji: "🦓", img: "animals/zebra"                      },
    { id: "hippo",     english: "Hippo",     thai: "ฮิปโป",     emoji: "🦛", img: "animals/hippo",     color: "pink"   },
    { id: "rhino",     english: "Rhino",     thai: "แรด",       emoji: "🦏", img: "animals/rhino"                      },
    { id: "crocodile", english: "Crocodile", thai: "จระเข้",    emoji: "🐊", img: "animals/crocodile", color: "green"  },
    { id: "snake",     english: "Snake",     thai: "งู",        emoji: "🐍", img: "animals/snake",     color: "green"  },
    { id: "whale",     english: "Whale",     thai: "วาฬ",       emoji: "🐳", img: "animals/whale",     color: "blue"   },
    { id: "shark",     english: "Shark",     thai: "ฉลาม",      emoji: "🦈", img: "animals/shark",     color: "blue"   },
    { id: "crab",      english: "Crab",      thai: "ปู",        emoji: "🦀", img: "animals/crab",      color: "red"    },
    { id: "butterfly", english: "Butterfly", thai: "ผีเสื้อ",   emoji: "🦋", img: "animals/butterfly", color: "orange" },
    { id: "bee",       english: "Bee",       thai: "ผึ้ง",      emoji: "🐝", img: "animals/bee",       color: "yellow" },
    { id: "ladybug",   english: "Ladybug",   thai: "เต่าทอง",   emoji: "🐞", img: "animals/ladybug",   color: "red"    },
    { id: "squirrel",  english: "Squirrel",  thai: "กระรอก",    emoji: "🐿️", img: "animals/squirrel",  color: "brown"  },
    { id: "deer",      english: "Deer",      thai: "กวาง",      emoji: "🦌", img: "animals/deer",      color: "brown"  },
    { id: "parrot",    english: "Parrot",    thai: "นกแก้ว",    emoji: "🦜", img: "animals/parrot",    color: "red"    },
    { id: "peacock",   english: "Peacock",   thai: "นกยูง",     emoji: "🦚", img: "animals/peacock",   color: "green"  },
    { id: "seahorse",  english: "Seahorse",  thai: "ม้าน้ำ",    emoji: "🐴", img: "animals/seahorse",  color: "orange" }
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
