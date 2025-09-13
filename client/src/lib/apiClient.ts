// Central API client for all backend communication
import { config } from './config';

const API_BASE_URL = config.apiUrl;

// Authentication response interfaces
export interface AuthResponse {
  token: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// User interfaces based on .NET API schema
export interface AuthUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phoneNumber: string;
  role: number;
  progress?: UserProgress;
  setting?: UserSetting;
}

export interface UserProgress {
  id: string;
  userId: string;
  updatedAt: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  correctAnswersPercentage: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  averageSpentSecondsPerBilet: number;
  totalBiletAttempts: number;
  averageCorrectAnswersPerBilet: number;
}

export interface UserSetting {
  id: string;
  isNightMode: boolean;
  language: string;
  userId: string;
}

export interface TestQuestion {
  id: string;
  createdAt: string;
  updatedAt: string;
  photoUrl: string;
  nameUz: string;
  nameUzC: string;
  nameRu: string;
  index: number;
  result?: QuestionResult;
  biletId: string;
  answerOptions: AnswerOption[];
}

export interface QuestionResult {
  id: string;
  createdAt: string;
  updatedAt: string;
  timesAnswered: number;
  timesCorrect: number;
  lastTimeCorrect: boolean;
  lastAnsweredAt: string;
  userId: string;
  questionId: string;
  answerOptionId: string;
}

export interface AnswerOption {
  id: string;
  createdAt: string;
  updatedAt: string;
  isCorrect: boolean;
  textUz: string;
  textUzC: string;
  textRu: string;
  index: number;
  questionId: string;
}

export interface BiletInfo {
  id: string;
  number: number;
  title: string;
  titleUz: string;
  titleRu: string;
  titleUzC: string;
  description: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionUzC: string;
  questionCount: number;
  passed: boolean;
  correctAnswers: number | null;
}

export interface TopicInfo {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  bob: string;
  nameUz: string;
  nameUzC: string;
  nameRu: string;
  index: number;
  timesSolved: number;
  questionsCount: number;
  lastUserScoreId: string | null;
  lastUserScore: TopicScore | null;
}

export interface TopicScore {
  id: string;
  createdAt: string;
  updatedAt: string;
  testType: number;
  userId: string;
  biletId: string;
  topicId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  spentSeconds: number;
  questionAttempts: QuestionAttempt[];
}

export interface QuestionAttempt {
  id: string;
  createdAt: string;
  updatedAt: string;
  isCorrect: boolean;
  userId: string;
  questionId: string;
  question: TestQuestion;
  biletResultId: string;
  topicScoresId: string;
  answerOptionId: string;
}

export interface TestResult {
  id: string;
  testType: string;
  testName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timeSpent: number;
  completedAt: string;
}

export interface UserStats {
  totalTests: number;
  averageScore: number;
  studyStreak: number;
}

export interface ChartData {
  correct: number;
  incorrect: number;
  notSubmitted: number;
  correctnessPercentage: number;
  completionPercentage: number;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  constructor() {
    // Load token from storage when ApiClient is created
    const stored = localStorage.getItem("token");
    if (stored) {
      this.token = stored;
    }
  }

  private async request(endpoint: string, options?: RequestInit) {
    // normalize headers to Record<string, string>
    const normalizedHeaders: Record<string, string> = {
      ...(options?.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : (options?.headers as Record<string, string> | undefined)),
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...normalizedHeaders,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      
      try {
        const contentType = response.headers.get("content-type");
        
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          // Handle various .NET API error formats
          errorMessage = errorData.message || errorData.error || errorData.title || errorMessage;
        } else {
          const textError = await response.text();
          if (textError) {
            errorMessage = textError;
          }
        }
      } catch (parseError) {
        // Keep the default error message if parsing fails
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    } else {
      return response.text();
    }
  }


  // Authentication
  async login(phoneNumber: string, password: string): Promise<string> {
    const response: AuthResponse = await this.request(config.endpoints.login, {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, password }),
    });

    const token = response.token;
    localStorage.setItem("token", token);
    this.setToken(token);
    return token;
  }


  async register(name: string, phoneNumber: string, password: string): Promise<void> {
    return this.request(config.endpoints.register, {
      method: 'POST',
      body: JSON.stringify({ name, phoneNumber, password }),
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem("token");
    this.setToken(null);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await this.request(config.endpoints.userMe);
    } catch (error) {
      return null;
    }
  }

  async updateProfile(name: string): Promise<void> {
    return this.request(config.endpoints.updateUser, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  // Test Data
  async getBilets(): Promise<BiletInfo[]> {
    return this.request(config.endpoints.bilets);
  }

  async getTopics(): Promise<TopicInfo[]> {
    return this.request(`${config.endpoints.topics}?PageSize=1000`);
  }

  async getTestQuestions(testType: string, testId: string): Promise<TestQuestion[]> {
    return this.request(`/test/${testType}/${testId}`);
  }

  async submitTest(
    testType: string, 
    testId: string, 
    answers: Record<string, number>,
    timeSpent: number = 0
  ): Promise<{
    id: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    passed: boolean;
    timeSpent: number;
  }> {
    return this.request(`/test/${testType}/${testId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent }),
    });
  }

  async getTestResults(): Promise<TestResult[]> {
    return this.request(config.endpoints.testResults);
  }

  async getUserStats(): Promise<UserStats> {
    return this.request(config.endpoints.userStats);
  }

  // Convert stats to chart data format for compatibility
  async getTestResultsChart(): Promise<ChartData> {
    const results = await this.getTestResults();
    
    if (results.length === 0) {
      return {
        correct: 0,
        incorrect: 0,
        notSubmitted: 0,
        correctnessPercentage: 0,
        completionPercentage: 0,
      };
    }

    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
    const totalIncorrect = results.reduce((sum, r) => sum + (r.totalQuestions - r.correctAnswers), 0);
    
    return {
      correct: totalCorrect,
      incorrect: totalIncorrect,
      notSubmitted: 0, // All questions in our system are submitted
      correctnessPercentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      completionPercentage: 100, // All tests are completed when submitted
    };
  }
}

export const apiClient = new ApiClient();

// Legacy exports for backward compatibility  
export type { BiletInfo as Bilet, TopicInfo as Topic, ChartData as LegacyTestResult };