// Central API client for all backend communication
const API_BASE_URL = '/api';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface TestQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number;
}

interface Bilet {
  id: string;
  number: number;
  questionCount: number;
  passed: boolean;
  correctAnswers?: number;
}

interface Topic {
  id: string;
  name: string;
  questionCount: number;
  passed: boolean;
  correctAnswers?: number;
}

interface TestResult {
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
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<AuthUser> {
    // TODO: Replace with real API call
    console.log('Login attempt:', { email, password });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return {
      id: '1',
      name: 'Test User',
      email,
    };
  }

  async logout(): Promise<void> {
    // TODO: Replace with real API call
    console.log('Logout');
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // TODO: Replace with real API call
    // For demo purposes, return a mock user
    return {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };
  }

  async updateProfile(name: string): Promise<AuthUser> {
    // TODO: Replace with real API call
    console.log('Update profile:', { name });
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: '1',
      name,
      email: 'test@example.com',
    };
  }

  // Test Data
  async getBilets(): Promise<Bilet[]> {
    // TODO: Replace with real API call
    const bilets: Bilet[] = [];
    for (let i = 1; i <= 58; i++) {
      bilets.push({
        id: `bilet-${i}`,
        number: i,
        questionCount: 20,
        passed: Math.random() > 0.7,
        correctAnswers: Math.random() > 0.7 ? Math.floor(Math.random() * 8) + 12 : undefined,
      });
    }
    return bilets;
  }

  async getTopics(): Promise<Topic[]> {
    // TODO: Replace with real API call
    const topicNames = [
      'Grammar Basics', 'Vocabulary', 'Reading Comprehension', 'Writing Skills',
      'Listening Practice', 'Speaking Basics', 'Advanced Grammar', 'Business English',
      'Academic Writing', 'Conversation Skills', 'Pronunciation', 'Idioms',
      'Technical Terms', 'Literature', 'Essay Writing'
    ];
    
    return topicNames.map((name, index) => ({
      id: `topic-${index + 1}`,
      name,
      questionCount: Math.floor(Math.random() * 45) + 5,
      passed: Math.random() > 0.6,
      correctAnswers: Math.random() > 0.6 ? Math.floor(Math.random() * 20) + 10 : undefined,
    }));
  }

  async getTestResults(): Promise<TestResult> {
    // TODO: Replace with real API call
    const correct = Math.floor(Math.random() * 80) + 20;
    const incorrect = Math.floor(Math.random() * 30) + 10;
    const notSubmitted = Math.floor(Math.random() * 20) + 5;
    const total = correct + incorrect + notSubmitted;
    
    return {
      correct,
      incorrect,
      notSubmitted,
      correctnessPercentage: Math.round((correct / (correct + incorrect)) * 100),
      completionPercentage: Math.round(((correct + incorrect) / total) * 100),
    };
  }

  async getTestQuestions(testType: string, testId: string): Promise<TestQuestion[]> {
    // TODO: Replace with real API call
    console.log('Fetching questions for:', { testType, testId });
    
    const questions: TestQuestion[] = [];
    const questionCount = testType === 'real' ? 20 : Math.floor(Math.random() * 30) + 10;
    
    for (let i = 0; i < questionCount; i++) {
      questions.push({
        id: `q-${i + 1}`,
        text: `This is question ${i + 1} for ${testType} test. Choose the correct answer from the options below.`,
        options: [
          `Option A for question ${i + 1}`,
          `Option B for question ${i + 1}`,
          `Option C for question ${i + 1}`,
          `Option D for question ${i + 1}`,
        ],
      });
    }
    
    return questions;
  }

  async submitTest(testType: string, testId: string, answers: Record<string, number>): Promise<void> {
    // TODO: Replace with real API call
    console.log('Submitting test:', { testType, testId, answers });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export const apiClient = new ApiClient();
export type { AuthUser, TestQuestion, Bilet, Topic, TestResult };