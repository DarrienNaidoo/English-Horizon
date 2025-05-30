// AI-powered conversation practice system
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    scenario?: string;
    difficulty?: string;
    corrections?: string[];
    suggestions?: string[];
  };
}

export interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'daily' | 'business' | 'travel' | 'academic';
  systemPrompt: string;
  objectives: string[];
  vocabularyFocus: string[];
}

// AI Conversation Service
export class ConversationAI {
  private scenarios: ConversationScenario[] = [
    {
      id: 'coffee-shop',
      title: 'Ordering at a Coffee Shop',
      description: 'Practice ordering drinks and food at a café',
      level: 'beginner',
      category: 'daily',
      systemPrompt: `You are a friendly barista at a coffee shop. Help the customer practice ordering in English. 
      - Ask about their drink preference, size, and any additions
      - Suggest popular items if they seem unsure
      - Be patient and encouraging
      - Gently correct any grammar mistakes by repeating correctly
      - Keep the conversation natural and helpful`,
      objectives: ['Order drinks and food', 'Ask about prices', 'Practice politeness'],
      vocabularyFocus: ['coffee', 'latte', 'size', 'medium', 'large', 'please', 'thank you']
    },
    {
      id: 'job-interview',
      title: 'Job Interview Practice',
      description: 'Prepare for English job interviews',
      level: 'intermediate',
      category: 'business',
      systemPrompt: `You are a professional interviewer conducting a job interview. 
      - Ask common interview questions
      - Provide constructive feedback on responses
      - Help with professional vocabulary
      - Encourage confidence and clarity
      - Suggest improvements for better answers`,
      objectives: ['Answer interview questions', 'Describe experience', 'Ask about the role'],
      vocabularyFocus: ['experience', 'skills', 'responsibilities', 'achievement', 'teamwork']
    },
    {
      id: 'hotel-checkin',
      title: 'Hotel Check-in',
      description: 'Practice checking into a hotel',
      level: 'beginner',
      category: 'travel',
      systemPrompt: `You are a hotel receptionist helping a guest check in.
      - Ask for their reservation details
      - Explain hotel amenities and policies
      - Be helpful with directions and recommendations
      - Use clear, simple English
      - Correct mistakes gently`,
      objectives: ['Check in to hotel', 'Ask about amenities', 'Get local information'],
      vocabularyFocus: ['reservation', 'room', 'breakfast', 'wifi', 'checkout', 'elevator']
    }
  ];

  getScenarios(): ConversationScenario[] {
    return this.scenarios;
  }

  getScenario(id: string): ConversationScenario | undefined {
    return this.scenarios.find(s => s.id === id);
  }

  async generateResponse(
    scenarioId: string, 
    messages: ConversationMessage[], 
    userMessage: string
  ): Promise<{
    response: string;
    corrections: string[];
    suggestions: string[];
  }> {
    const scenario = this.getScenario(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    // Check if external AI service is available
    if (process.env.ANTHROPIC_API_KEY) {
      return this.generateAIResponse(scenario, messages, userMessage);
    }

    // Fallback to rule-based responses
    return this.generateRuleBasedResponse(scenario, userMessage);
  }

  private async generateAIResponse(
    scenario: ConversationScenario,
    messages: ConversationMessage[],
    userMessage: string
  ): Promise<{ response: string; corrections: string[]; suggestions: string[]; }> {
    try {
      // This would integrate with Anthropic API when key is provided
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `${scenario.systemPrompt}\n\nUser said: "${userMessage}"\n\nRespond as the character, and also provide any grammar corrections and helpful suggestions in this format:
              
Response: [your character response]
Corrections: [any grammar fixes needed]
Suggestions: [helpful tips for better English]`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      // Parse the structured response
      const responseMatch = content.match(/Response: (.*?)(?=Corrections:|$)/s);
      const correctionsMatch = content.match(/Corrections: (.*?)(?=Suggestions:|$)/s);
      const suggestionsMatch = content.match(/Suggestions: (.*?)$/s);

      return {
        response: responseMatch?.[1]?.trim() || content,
        corrections: correctionsMatch?.[1]?.trim() ? [correctionsMatch[1].trim()] : [],
        suggestions: suggestionsMatch?.[1]?.trim() ? [suggestionsMatch[1].trim()] : []
      };
    } catch (error) {
      // Fallback to rule-based if AI fails
      return this.generateRuleBasedResponse(scenario, userMessage);
    }
  }

  private generateRuleBasedResponse(
    scenario: ConversationScenario,
    userMessage: string
  ): { response: string; corrections: string[]; suggestions: string[]; } {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple pattern matching for demo
    const responses: Record<string, string[]> = {
      'coffee-shop': [
        "Hello! Welcome to our coffee shop. What can I get for you today?",
        "Would you like to try our special latte? It's very popular!",
        "What size would you prefer - small, medium, or large?",
        "That'll be $4.50. Will that be for here or to go?",
        "Thank you! Your order will be ready in just a moment."
      ],
      'job-interview': [
        "Thank you for coming in today. Could you start by telling me about yourself?",
        "What interests you most about this position?",
        "Can you describe a challenge you've overcome in your previous work?",
        "What are your greatest strengths?",
        "Do you have any questions about our company or this role?"
      ],
      'hotel-checkin': [
        "Good evening! Welcome to our hotel. Do you have a reservation with us?",
        "Perfect! I have your reservation here. You're staying in room 304.",
        "Here's your key card. The elevator is just down the hall to your right.",
        "Breakfast is served from 7 to 10 AM in our restaurant on the ground floor.",
        "Is there anything else I can help you with today?"
      ]
    };

    const scenarioResponses = responses[scenario.id] || responses['coffee-shop'];
    const randomResponse = scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];

    // Simple grammar checking
    const corrections: string[] = [];
    if (lowerMessage.includes('i want') && !lowerMessage.includes('i would like')) {
      corrections.push('Try saying "I would like" instead of "I want" for politeness');
    }

    const suggestions: string[] = [];
    if (scenario.vocabularyFocus.some(word => !lowerMessage.includes(word))) {
      suggestions.push(`Try using words like: ${scenario.vocabularyFocus.slice(0, 3).join(', ')}`);
    }

    return {
      response: randomResponse,
      corrections,
      suggestions
    };
  }
}

export const conversationAI = new ConversationAI();