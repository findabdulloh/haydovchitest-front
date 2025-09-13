// UI translations for different languages
export const translations = {
  // Navigation & Layout
  dashboard: {
    uz: "Bosh sahifa",
    uzc: "Бош саҳифа", 
    ru: "Панель управления"
  },
  topics: {
    uz: "Mavzular",
    uzc: "Мавзулар",
    ru: "Темы"
  },
  bilets: {
    uz: "Biletlar", 
    uzc: "Билетлар",
    ru: "Билеты"
  },
  tests: {
    uz: "Testlar",
    uzc: "Тестлар", 
    ru: "Тесты"
  },
  results: {
    uz: "Natijalar",
    uzc: "Натижалар",
    ru: "Результаты"
  },
  
  // Authentication
  signIn: {
    uz: "Kirish",
    uzc: "Кириш",
    ru: "Войти"
  },
  signOut: {
    uz: "Chiqish", 
    uzc: "Чиқиш",
    ru: "Выйти"
  },
  register: {
    uz: "Ro'yxatdan o'tish",
    uzc: "Рўйхатдан ўтиш", 
    ru: "Регистрация"
  },
  createAccount: {
    uz: "Hisob yaratish",
    uzc: "Ҳисоб яратиш",
    ru: "Создать аккаунт"
  },
  
  // Profile
  profile: {
    uz: "Profil",
    uzc: "Профил", 
    ru: "Профиль"
  },
  fullName: {
    uz: "To'liq ism",
    uzc: "Тўлиқ исм",
    ru: "Полное имя"
  },
  phoneNumber: {
    uz: "Telefon raqam",
    uzc: "Телефон рақам", 
    ru: "Номер телефона"
  },
  password: {
    uz: "Parol",
    uzc: "Парол",
    ru: "Пароль"
  },
  
  // Test Interface
  question: {
    uz: "Savol",
    uzc: "Савол",
    ru: "Вопрос"
  },
  nextQuestion: {
    uz: "Keyingi savol",
    uzc: "Кейинги савол",
    ru: "Следующий вопрос"
  },
  previousQuestion: {
    uz: "Oldingi savol", 
    uzc: "Олдинги савол",
    ru: "Предыдущий вопрос"
  },
  finishTest: {
    uz: "Testni tugatish",
    uzc: "Тестни тугатиш",
    ru: "Завершить тест"
  },
  startTest: {
    uz: "Testni boshlash",
    uzc: "Тестни бошлаш", 
    ru: "Начать тест"
  },
  
  // Results & Status
  passed: {
    uz: "O'tdi",
    uzc: "Ўтди",
    ru: "Пройден"
  },
  failed: {
    uz: "O'tmadi", 
    uzc: "Ўтмади",
    ru: "Не пройден"
  },
  notAttempted: {
    uz: "Urinmagan",
    uzc: "Уринмаган",
    ru: "Не пытался"
  },
  correctAnswers: {
    uz: "To'g'ri javoblar",
    uzc: "Тўғри жавоблар",
    ru: "Правильные ответы"
  },
  totalQuestions: {
    uz: "Jami savollar", 
    uzc: "Жами саволлар",
    ru: "Всего вопросов"
  },
  score: {
    uz: "Ball",
    uzc: "Балл",
    ru: "Оценка"
  },
  
  // Common Actions
  save: {
    uz: "Saqlash",
    uzc: "Сақлаш", 
    ru: "Сохранить"
  },
  cancel: {
    uz: "Bekor qilish",
    uzc: "Бекор қилиш",
    ru: "Отменить"
  },
  edit: {
    uz: "Tahrirlash",
    uzc: "Таҳрирлаш",
    ru: "Редактировать"
  },
  delete: {
    uz: "O'chirish",
    uzc: "Ўчириш", 
    ru: "Удалить"
  },
  loading: {
    uz: "Yuklanmoqda...",
    uzc: "Юкланмоқда...",
    ru: "Загрузка..."
  },
  
  // Messages
  welcomeBack: {
    uz: "Xush kelibsiz!",
    uzc: "Хуш келибсиз!",
    ru: "Добро пожаловать!"
  },
  accountCreated: {
    uz: "Hisob yaratildi!",
    uzc: "Ҳисоб яратилди!", 
    ru: "Аккаунт создан!"
  },
  signInFailed: {
    uz: "Kirishda xatolik",
    uzc: "Киришда хатолик",
    ru: "Ошибка входа"
  },
  registrationFailed: {
    uz: "Ro'yxatdan o'tishda xatolik",
    uzc: "Рўйхатдан ўтишда хатолик",
    ru: "Ошибка регистрации"
  }
} as const;

export type TranslationKey = keyof typeof translations;