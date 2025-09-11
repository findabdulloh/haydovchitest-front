// Central API client for all backend communication
const API_BASE_URL = '/api';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
}

export interface TestQuestion {
  id: string;
  questionText: string;
  questionTextUz: string;
  questionTextRu: string;
  questionTextUzC: string;
  options: string[];
  optionsUz: string[];
  optionsRu: string[];
  optionsUzC: string[];
  correctAnswer: number;
  imageUrl?: string;
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
  name: string;
  nameUz: string;
  nameRu: string;
  nameUzC: string;
  description: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionUzC: string;
  questionCount: number;
  passed: boolean;
  bestScore: number | null;
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
  private async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(phone: string, password: string): Promise<AuthUser> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  }

  async register(phone: string, password: string, name: string): Promise<AuthUser> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password, name }),
    });
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await this.request('/auth/me');
    } catch (error) {
      return null;
    }
  }

  async updateProfile(name: string): Promise<AuthUser> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  // Test Data
  async getBilets(): Promise<BiletInfo[]> {
    return this.request('/bilets');
  }

  async getTopics(): Promise<TopicInfo[]> {
    return this.request('/topics');
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
    return this.request('/results');
  }

  async getUserStats(): Promise<UserStats> {
    return this.request('/stats');
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