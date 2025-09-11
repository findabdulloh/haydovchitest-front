import { 
  type User, 
  type InsertUser, 
  type Bilet, 
  type InsertBilet,
  type Question,
  type InsertQuestion,
  type Topic,
  type InsertTopic,
  type TestResult,
  type InsertTestResult
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bilet methods
  getBilets(): Promise<Bilet[]>;
  getBilet(id: string): Promise<Bilet | undefined>;
  createBilet(bilet: InsertBilet): Promise<Bilet>;
  
  // Question methods
  getQuestionsByBilet(biletId: string): Promise<Question[]>;
  getQuestionsByTopic(topicId: string): Promise<Question[]>;
  getRandomQuestions(count: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Topic methods
  getTopics(): Promise<Topic[]>;
  getTopic(id: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  
  // Test result methods
  getTestResults(userId: string): Promise<TestResult[]>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getUserStats(userId: string): Promise<{
    totalTests: number;
    averageScore: number;
    studyStreak: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bilets: Map<string, Bilet>;
  private questions: Map<string, Question>;
  private topics: Map<string, Topic>;
  private testResults: Map<string, TestResult>;

  constructor() {
    this.users = new Map();
    this.bilets = new Map();
    this.questions = new Map();
    this.topics = new Map();
    this.testResults = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample topics
    const topics = [
      { 
        id: randomUUID(), 
        name: 'Road Signs', 
        nameUz: 'Yo\'l belgilari', 
        nameRu: 'Дорожные знаки', 
        nameUzC: 'Йўл белгилари',
        description: 'Traffic signs and their meanings', 
        descriptionUz: 'Yo\'l belgilari va ularning ma\'nolari',
        descriptionRu: 'Дорожные знаки и их значения',
        descriptionUzC: 'Йўл белгилари ва уларнинг маънолари',
        questionCount: 15 
      },
      { 
        id: randomUUID(), 
        name: 'Traffic Rules', 
        nameUz: 'Yo\'l qoidalari', 
        nameRu: 'Правила дорожного движения', 
        nameUzC: 'Йўл қоидалари',
        description: 'Basic traffic regulations', 
        descriptionUz: 'Asosiy yo\'l harakat qoidalari',
        descriptionRu: 'Основные правила дорожного движения',
        descriptionUzC: 'Асосий йўл ҳаракат қоидалари',
        questionCount: 25 
      },
      { 
        id: randomUUID(), 
        name: 'Vehicle Safety', 
        nameUz: 'Transport vositasi xavfsizligi', 
        nameRu: 'Безопасность транспортного средства', 
        nameUzC: 'Транспорт воситаси хавфсизлиги',
        description: 'Safety procedures and checks', 
        descriptionUz: 'Xavfsizlik tartib-qoidalari va tekshiruvlari',
        descriptionRu: 'Процедуры безопасности и проверки',
        descriptionUzC: 'Хавфсизлик тартиб-қоидалари ва текширувлари',
        questionCount: 12 
      },
      { 
        id: randomUUID(), 
        name: 'Emergency Situations', 
        nameUz: 'Favqulodda vaziyatlar', 
        nameRu: 'Чрезвычайные ситуации', 
        nameUzC: 'Фавқулодда вазиятлар',
        description: 'Handling emergencies on the road', 
        descriptionUz: 'Yo\'lda favqulodda vaziyatlarni hal qilish',
        descriptionRu: 'Решение чрезвычайных ситуаций на дороге',
        descriptionUzC: 'Йўлда фавқулодда вазиятларни ҳал қилиш',
        questionCount: 8 
      },
    ];
    
    topics.forEach(topic => {
      const topicRecord: Topic = {
        id: topic.id,
        name: topic.name,
        nameUz: topic.nameUz,
        nameRu: topic.nameRu,
        nameUzC: topic.nameUzC,
        description: topic.description,
        descriptionUz: topic.descriptionUz,
        descriptionRu: topic.descriptionRu,
        descriptionUzC: topic.descriptionUzC,
        questionCount: topic.questionCount,
        createdAt: new Date()
      };
      this.topics.set(topic.id, topicRecord);
    });

    // Create sample bilets
    for (let i = 1; i <= 10; i++) {
      const biletId = randomUUID();
      const bilet: Bilet = {
        id: biletId,
        number: i,
        title: `Bilet ${i}`,
        titleUz: `Bilet ${i}`,
        titleRu: `Билет ${i}`,
        titleUzC: `Билет ${i}`,
        description: `Standard test bilet with 20 questions`,
        descriptionUz: `20 ta savoldan iborat standart test bileti`,
        descriptionRu: `Стандартный тестовый билет с 20 вопросами`,
        descriptionUzC: `20 та саволдан иборат стандарт тест билети`,
        questionCount: 20,
        createdAt: new Date()
      };
      this.bilets.set(biletId, bilet);

      // Create sample questions for each bilet
      for (let j = 1; j <= 20; j++) {
        const questionId = randomUUID();
        const topicIds = Array.from(this.topics.keys());
        const randomTopic = topicIds[Math.floor(Math.random() * topicIds.length)];
        
        const question: Question = {
          id: questionId,
          biletId,
          topicId: randomTopic,
          questionText: `What is the correct action in this driving scenario ${j}?`,
          questionTextUz: `Ushbu haydash stsenariysi ${j}da to'g'ri harakat nima?`,
          questionTextRu: `Какое правильное действие в данном сценарии вождения ${j}?`,
          questionTextUzC: `Ушбу ҳайдаш стсенарийси ${j}да тўғри ҳаракат нима?`,
          options: [
            'Stop completely and wait',
            'Proceed with caution', 
            'Yield to other traffic',
            'Continue at normal speed'
          ],
          optionsUz: [
            'To\'liq to\'xtab kuting',
            'Ehtiyotkorlik bilan davom eting',
            'Boshqa transport vositalariga yo\'l bering',
            'Oddiy tezlikda davom eting'
          ],
          optionsRu: [
            'Полностью остановиться и ждать',
            'Продолжить с осторожностью',
            'Уступить дорогу другому транспорту',
            'Продолжить с обычной скоростью'
          ],
          optionsUzC: [
            'Тўлиқ тўхтаб кутинг',
            'Эҳтиёткорлик билан давом етинг',
            'Бошқа транспорт воситаларига йўл беринг',
            'Оддий тезликда давом етинг'
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: 'This is the correct answer based on traffic regulations.',
          explanationUz: 'Bu yo\'l harakat qoidalariga asoslangan to\'g\'ri javob.',
          explanationRu: 'Это правильный ответ, основанный на правилах дорожного движения.',
          explanationUzC: 'Бу йўл ҳаракат қоидаларига асосланган тўғри жавоб.',
          imageUrl: null,
          createdAt: new Date()
        };
        this.questions.set(questionId, question);
      }
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phone === phone,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Bilet methods
  async getBilets(): Promise<Bilet[]> {
    return Array.from(this.bilets.values()).sort((a, b) => a.number - b.number);
  }

  async getBilet(id: string): Promise<Bilet | undefined> {
    return this.bilets.get(id);
  }

  async createBilet(insertBilet: InsertBilet): Promise<Bilet> {
    const id = randomUUID();
    const bilet: Bilet = {
      id,
      number: insertBilet.number,
      title: insertBilet.title,
      titleUz: insertBilet.title, // Using same as title for now
      titleRu: insertBilet.title, // Using same as title for now
      titleUzC: insertBilet.title, // Using same as title for now
      description: insertBilet.description ?? null,
      descriptionUz: insertBilet.description ?? null,
      descriptionRu: insertBilet.description ?? null,
      descriptionUzC: insertBilet.description ?? null,
      questionCount: insertBilet.questionCount ?? 20,
      createdAt: new Date()
    };
    this.bilets.set(id, bilet);
    return bilet;
  }

  // Question methods
  async getQuestionsByBilet(biletId: string): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.biletId === biletId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getQuestionsByTopic(topicId: string): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.topicId === topicId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getRandomQuestions(count: number): Promise<Question[]> {
    const allQuestions = Array.from(this.questions.values());
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      id,
      biletId: insertQuestion.biletId ?? null,
      topicId: insertQuestion.topicId ?? null,
      questionText: insertQuestion.questionText,
      questionTextUz: insertQuestion.questionText, // Using same as questionText for now
      questionTextRu: insertQuestion.questionText, // Using same as questionText for now
      questionTextUzC: insertQuestion.questionText, // Using same as questionText for now
      options: [...insertQuestion.options],
      optionsUz: [...insertQuestion.options], // Using same as options for now
      optionsRu: [...insertQuestion.options], // Using same as options for now
      optionsUzC: [...insertQuestion.options], // Using same as options for now
      correctAnswer: insertQuestion.correctAnswer,
      explanation: insertQuestion.explanation ?? null,
      explanationUz: insertQuestion.explanation ?? null,
      explanationRu: insertQuestion.explanation ?? null,
      explanationUzC: insertQuestion.explanation ?? null,
      imageUrl: insertQuestion.imageUrl ?? null,
      createdAt: new Date()
    };
    this.questions.set(id, question);
    return question;
  }

  // Topic methods
  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = randomUUID();
    const topic: Topic = {
      id,
      name: insertTopic.name,
      nameUz: insertTopic.name, // Using same as name for now
      nameRu: insertTopic.name, // Using same as name for now
      nameUzC: insertTopic.name, // Using same as name for now
      description: insertTopic.description ?? null,
      descriptionUz: insertTopic.description ?? null,
      descriptionRu: insertTopic.description ?? null,
      descriptionUzC: insertTopic.description ?? null,
      questionCount: insertTopic.questionCount ?? 0,
      createdAt: new Date()
    };
    this.topics.set(id, topic);
    return topic;
  }

  // Test result methods
  async getTestResults(userId: string): Promise<TestResult[]> {
    return Array.from(this.testResults.values())
      .filter(result => result.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async createTestResult(insertResult: InsertTestResult): Promise<TestResult> {
    const id = randomUUID();
    const result: TestResult = { 
      ...insertResult, 
      id, 
      completedAt: new Date() 
    };
    this.testResults.set(id, result);
    return result;
  }

  async getUserStats(userId: string): Promise<{
    totalTests: number;
    averageScore: number;
    studyStreak: number;
  }> {
    const userResults = await this.getTestResults(userId);
    
    const totalTests = userResults.length;
    const averageScore = totalTests > 0 
      ? Math.round(userResults.reduce((sum, result) => sum + result.score, 0) / totalTests)
      : 0;
    
    // Simple streak calculation - consecutive days with tests
    const studyStreak = this.calculateStudyStreak(userResults);
    
    return {
      totalTests,
      averageScore,
      studyStreak
    };
  }

  private calculateStudyStreak(results: TestResult[]): number {
    if (results.length === 0) return 0;
    
    const sortedDates = results
      .map(r => r.completedAt.toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    const today = new Date().toDateString();
    let currentDate = new Date(today);
    
    for (const dateString of sortedDates) {
      const testDate = new Date(dateString);
      const daysDiff = Math.floor(
        (currentDate.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff <= 1 && daysDiff >= 0) {
        streak++;
        currentDate = testDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

export const storage = new MemStorage();
