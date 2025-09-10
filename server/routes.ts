import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTestResultSchema } from "@shared/schema";

// Extend Express Request type to include session
declare module 'express-serve-static-core' {
  interface Request {
    session: {
      userId?: string;
      destroy(callback: (err: any) => void): void;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { phone, password } = req.body;
      
      if (!phone || !password) {
        return res.status(400).json({ error: 'Phone and password are required' });
      }

      const user = await storage.getUserByPhone(phone);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // In production, use proper session management
      req.session.userId = user.id;
      
      res.json({
        id: user.id,
        name: user.name,
        phone: user.phone
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByPhone(userData.phone);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this phone number already exists' });
      }

      const user = await storage.createUser(userData);
      
      // In production, use proper session management
      req.session.userId = user.id;
      
      res.json({
        id: user.id,
        name: user.name,
        phone: user.phone
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        name: user.name,
        phone: user.phone
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/auth/profile', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // For now, just return the updated user data
      // In a real implementation, you'd update the user in storage
      res.json({
        id: user.id,
        name,
        phone: user.phone
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Profile update failed' });
    }
  });

  // Test routes
  app.get('/api/bilets', async (req, res) => {
    try {
      const bilets = await storage.getBilets();
      
      // Add completion status for each bilet
      const biletsWithStatus = await Promise.all(
        bilets.map(async (bilet) => {
          const results = req.session.userId
            ? await storage.getTestResults(req.session.userId)
            : [];
          
          const biletResult = results.find(
            (r) => r.testType === 'bilet' && r.testId === bilet.id
          );
          
          return {
            id: bilet.id,
            number: bilet.number,
            title: bilet.title,
            description: bilet.description,
            questionCount: bilet.questionCount,
            passed: biletResult?.passed || false,
            correctAnswers: biletResult?.correctAnswers || null,
          };
        })
      );
      
      res.json(biletsWithStatus);
    } catch (error) {
      console.error('Get bilets error:', error);
      res.status(500).json({ error: 'Failed to fetch bilets' });
    }
  });

  app.get('/api/topics', async (req, res) => {
    try {
      const topics = await storage.getTopics();
      
      // Add completion status for each topic
      const topicsWithStatus = await Promise.all(
        topics.map(async (topic) => {
          const results = req.session.userId
            ? await storage.getTestResults(req.session.userId)
            : [];
          
          const topicResults = results.filter(
            (r) => r.testType === 'topic' && r.testId === topic.id
          );
          
          const bestResult = topicResults.reduce(
            (best, current) => 
              current.score > (best?.score || 0) ? current : best,
            topicResults[0] || null
          );
          
          return {
            id: topic.id,
            name: topic.name,
            description: topic.description,
            questionCount: topic.questionCount,
            passed: bestResult?.passed || false,
            bestScore: bestResult?.score || null,
          };
        })
      );
      
      res.json(topicsWithStatus);
    } catch (error) {
      console.error('Get topics error:', error);
      res.status(500).json({ error: 'Failed to fetch topics' });
    }
  });

  app.get('/api/test/:testType/:testId', async (req, res) => {
    try {
      const { testType, testId } = req.params;
      let questions;
      
      switch (testType) {
        case 'bilet':
          questions = await storage.getQuestionsByBilet(testId);
          break;
        case 'topic':
          questions = await storage.getQuestionsByTopic(testId);
          break;
        case 'real':
          questions = await storage.getRandomQuestions(20);
          break;
        default:
          return res.status(400).json({ error: 'Invalid test type' });
      }
      
      // Don't send the correct answers to the client
      const clientQuestions = questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        imageUrl: q.imageUrl,
      }));
      
      res.json(clientQuestions);
    } catch (error) {
      console.error('Get test questions error:', error);
      res.status(500).json({ error: 'Failed to fetch test questions' });
    }
  });

  app.post('/api/test/:testType/:testId/submit', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { testType, testId } = req.params;
      const { answers, timeSpent = 0 } = req.body;
      
      let questions;
      switch (testType) {
        case 'bilet':
          questions = await storage.getQuestionsByBilet(testId);
          break;
        case 'topic':
          questions = await storage.getQuestionsByTopic(testId);
          break;
        case 'real':
          // For real tests, we need to get the same questions that were served
          // In production, you'd store the question set in the session
          questions = await storage.getRandomQuestions(20);
          break;
        default:
          return res.status(400).json({ error: 'Invalid test type' });
      }
      
      // Calculate score using question IDs
      let correctAnswers = 0;
      questions.forEach((question) => {
        const userAnswer = answers[question.id];
        if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      const totalQuestions = questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = testType === 'real' ? correctAnswers >= 17 : score >= 80; // Real test needs 17/20
      
      const testResult = await storage.createTestResult({
        userId: req.session.userId,
        testType,
        testId,
        score,
        totalQuestions,
        correctAnswers,
        timeSpent,
        answers,
        passed,
      });
      
      res.json({
        id: testResult.id,
        score,
        totalQuestions,
        correctAnswers,
        passed,
        timeSpent,
      });
    } catch (error) {
      console.error('Submit test error:', error);
      res.status(500).json({ error: 'Failed to submit test' });
    }
  });

  app.get('/api/results', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const results = await storage.getTestResults(req.session.userId);
      
      // Enhance results with test details
      const enhancedResults = await Promise.all(
        results.map(async (result) => {
          let testName = 'Unknown Test';
          
          if (result.testType === 'bilet') {
            const bilet = await storage.getBilet(result.testId);
            testName = bilet ? `Bilet ${bilet.number}` : 'Unknown Bilet';
          } else if (result.testType === 'topic') {
            const topic = await storage.getTopic(result.testId);
            testName = topic ? topic.name : 'Unknown Topic';
          } else if (result.testType === 'real') {
            testName = 'Real Test';
          }
          
          return {
            id: result.id,
            testType: result.testType,
            testName,
            score: result.score,
            totalQuestions: result.totalQuestions,
            correctAnswers: result.correctAnswers,
            passed: result.passed,
            timeSpent: result.timeSpent,
            completedAt: result.completedAt,
          };
        })
      );
      
      res.json(enhancedResults);
    } catch (error) {
      console.error('Get results error:', error);
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const stats = await storage.getUserStats(req.session.userId);
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
