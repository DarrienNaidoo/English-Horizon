// Animated progress tracking with cute mascot characters
export interface Mascot {
  id: string;
  name: string;
  type: 'owl' | 'fox' | 'bear' | 'rabbit' | 'cat' | 'dragon' | 'panda';
  personality: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;
  animations: MascotAnimation[];
  expressions: MascotExpression[];
  accessories: MascotAccessory[];
  encouragementPhrases: string[];
  celebrationPhrases: string[];
  motivationalPhrases: string[];
  description: string;
  backstory: string;
  favoriteActivities: string[];
  specialAbilities: string[];
}

export interface MascotAnimation {
  name: string;
  type: 'idle' | 'celebration' | 'encouragement' | 'thinking' | 'sleeping' | 'excited' | 'studying';
  duration: number; // milliseconds
  frames: AnimationFrame[];
  triggerConditions: string[];
  soundEffect?: string;
}

export interface AnimationFrame {
  frameNumber: number;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  opacity: number;
  expression: string;
  accessories: string[];
  effects: VisualEffect[];
}

export interface VisualEffect {
  type: 'sparkles' | 'hearts' | 'stars' | 'confetti' | 'glow' | 'bounce' | 'rainbow';
  intensity: number;
  duration: number;
  color?: string;
  size?: number;
}

export interface MascotExpression {
  name: string;
  mood: 'happy' | 'excited' | 'proud' | 'encouraging' | 'sleepy' | 'curious' | 'focused';
  eyeType: string;
  mouthType: string;
  earPosition: string;
  bodyPosture: string;
  usageContext: string[];
}

export interface MascotAccessory {
  id: string;
  name: string;
  type: 'hat' | 'glasses' | 'bow' | 'scarf' | 'badge' | 'book' | 'graduation_cap';
  unlockCondition: string;
  rarity: string;
  description: string;
  visualEffects: VisualEffect[];
  statBonus?: { type: string; value: number };
}

export interface UserMascot {
  userId: number;
  mascotId: string;
  nickname: string;
  level: number;
  experience: number;
  happiness: number; // 0-100
  energy: number; // 0-100
  lastInteraction: Date;
  equippedAccessories: string[];
  unlockedExpressions: string[];
  unlockedAnimations: string[];
  personalityTraits: string[];
  favoriteTime: string;
  customization: MascotCustomization;
  achievements: MascotAchievement[];
  streakWithUser: number;
}

export interface MascotCustomization {
  primaryColor: string;
  secondaryColor: string;
  eyeColor: string;
  pattern?: string;
  size: 'small' | 'medium' | 'large';
  voice: 'high' | 'medium' | 'low';
  speechBubbleStyle: string;
}

export interface MascotAchievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date;
  mascotLevel: number;
  reward: string;
}

export interface ProgressAnimation {
  id: string;
  type: 'level_up' | 'streak_milestone' | 'skill_mastery' | 'daily_goal' | 'achievement_unlock';
  mascotId: string;
  userId: number;
  progressData: ProgressData;
  animationSequence: AnimationSequence[];
  duration: number;
  celebrationIntensity: 'mild' | 'moderate' | 'intense' | 'epic';
  soundEffects: string[];
  particleEffects: ParticleEffect[];
  createdAt: Date;
}

export interface ProgressData {
  previousValue: number;
  newValue: number;
  maxValue: number;
  progressType: string;
  context: string;
  milestone?: string;
  reward?: string;
}

export interface AnimationSequence {
  step: number;
  mascotAnimation: string;
  duration: number;
  effects: VisualEffect[];
  message?: string;
  voiceLine?: string;
}

export interface ParticleEffect {
  type: 'confetti' | 'sparkles' | 'fireworks' | 'bubbles' | 'flowers' | 'stars';
  count: number;
  color: string[];
  gravity: number;
  velocity: { x: number; y: number };
  lifetime: number;
  size: { min: number; max: number };
}

export interface MascotInteraction {
  id: string;
  userId: number;
  mascotId: string;
  type: 'pet' | 'feed' | 'play' | 'study_together' | 'customize' | 'achievement_share';
  timestamp: Date;
  duration: number;
  happinessGain: number;
  energyChange: number;
  experienceGain: number;
  userSatisfaction: number;
  mascotResponse: MascotResponse;
}

export interface MascotResponse {
  animation: string;
  expression: string;
  message: string;
  soundEffect: string;
  effects: VisualEffect[];
  mood: string;
}

export interface StudySession {
  id: string;
  userId: number;
  mascotId: string;
  startTime: Date;
  endTime?: Date;
  activity: string;
  mascotBehavior: MascotBehavior[];
  progressMade: SessionProgress;
  mascotEncouragement: EncouragementEvent[];
  userEngagement: number;
  effectivenessBoost: number;
}

export interface MascotBehavior {
  timestamp: Date;
  behaviorType: 'encourage' | 'celebrate' | 'remind' | 'focus_help' | 'break_suggest';
  animation: string;
  message: string;
  effectiveness: number;
  userResponse: 'positive' | 'neutral' | 'negative';
}

export interface SessionProgress {
  tasksCompleted: number;
  pointsEarned: number;
  skillsImproved: string[];
  timeSpent: number;
  focusScore: number;
  mascotContribution: number;
}

export interface EncouragementEvent {
  timestamp: Date;
  trigger: string;
  mascotMessage: string;
  animation: string;
  userMotivationBoost: number;
  contextual: boolean;
}

export class MascotProgressSystem {
  private mascots: Map<string, Mascot> = new Map();
  private userMascots: Map<number, UserMascot> = new Map();
  private progressAnimations: Map<string, ProgressAnimation> = new Map();
  private interactions: Map<string, MascotInteraction[]> = new Map();
  private studySessions: Map<string, StudySession> = new Map();

  constructor() {
    this.initializeMascots();
    this.initializeSampleUserMascots();
  }

  private initializeMascots(): void {
    const mascots: Mascot[] = [
      {
        id: 'wise-owl',
        name: 'Professor Hoot',
        type: 'owl',
        personality: 'Wise and encouraging, loves grammar and vocabulary',
        rarity: 'common',
        unlockCondition: 'Complete first lesson',
        animations: [
          {
            name: 'reading',
            type: 'studying',
            duration: 3000,
            frames: [
              {
                frameNumber: 1,
                position: { x: 0, y: 0 },
                rotation: 0,
                scale: 1,
                opacity: 1,
                expression: 'focused',
                accessories: ['reading_glasses'],
                effects: []
              }
            ],
            triggerConditions: ['user_reading', 'grammar_exercise'],
            soundEffect: 'page_turn'
          },
          {
            name: 'celebration',
            type: 'celebration',
            duration: 2000,
            frames: [
              {
                frameNumber: 1,
                position: { x: 0, y: -10 },
                rotation: 15,
                scale: 1.2,
                opacity: 1,
                expression: 'happy',
                accessories: ['graduation_cap'],
                effects: [
                  {
                    type: 'sparkles',
                    intensity: 8,
                    duration: 2000,
                    color: 'gold',
                    size: 3
                  }
                ]
              }
            ],
            triggerConditions: ['level_up', 'achievement_unlock'],
            soundEffect: 'celebration_hoot'
          }
        ],
        expressions: [
          {
            name: 'focused',
            mood: 'focused',
            eyeType: 'wide_open',
            mouthType: 'small_o',
            earPosition: 'alert',
            bodyPosture: 'upright',
            usageContext: ['studying', 'thinking', 'reading']
          },
          {
            name: 'happy',
            mood: 'happy',
            eyeType: 'crescent',
            mouthType: 'smile',
            earPosition: 'perked',
            bodyPosture: 'bouncy',
            usageContext: ['celebration', 'achievement', 'success']
          }
        ],
        accessories: [
          {
            id: 'reading_glasses',
            name: 'Reading Glasses',
            type: 'glasses',
            unlockCondition: 'Complete 10 reading exercises',
            rarity: 'common',
            description: 'Stylish glasses for the scholarly owl',
            visualEffects: [
              {
                type: 'glow',
                intensity: 2,
                duration: 0,
                color: 'blue'
              }
            ],
            statBonus: { type: 'reading_speed', value: 5 }
          }
        ],
        encouragementPhrases: [
          "Great job! You're getting smarter every day!",
          "I'm proud of your dedication to learning!",
          "Knowledge is power, and you're building yours!"
        ],
        celebrationPhrases: [
          "Hoot hoot! Outstanding achievement!",
          "You've soared to new heights!",
          "Wisdom level: Expert!"
        ],
        motivationalPhrases: [
          "Every expert was once a beginner!",
          "Learning is a journey, not a destination!",
          "You've got this! I believe in you!"
        ],
        description: 'A wise owl who loves learning and sharing knowledge',
        backstory: 'Professor Hoot graduated from the prestigious Woodland University with honors in English Literature. He now dedicates his time to helping students reach their potential.',
        favoriteActivities: ['grammar exercises', 'reading comprehension', 'vocabulary building'],
        specialAbilities: ['Grammar insight', 'Vocabulary boost', 'Reading speed enhancement']
      },
      {
        id: 'clever-fox',
        name: 'Foxy',
        type: 'fox',
        personality: 'Clever and playful, excels at problem-solving',
        rarity: 'uncommon',
        unlockCondition: 'Reach level 5',
        animations: [
          {
            name: 'thinking',
            type: 'thinking',
            duration: 2500,
            frames: [
              {
                frameNumber: 1,
                position: { x: 5, y: 0 },
                rotation: -10,
                scale: 1,
                opacity: 1,
                expression: 'curious',
                accessories: [],
                effects: [
                  {
                    type: 'glow',
                    intensity: 3,
                    duration: 2500,
                    color: 'orange'
                  }
                ]
              }
            ],
            triggerConditions: ['problem_solving', 'quiz_question'],
            soundEffect: 'thinking_hmm'
          }
        ],
        expressions: [
          {
            name: 'curious',
            mood: 'curious',
            eyeType: 'bright',
            mouthType: 'slight_smile',
            earPosition: 'forward',
            bodyPosture: 'alert',
            usageContext: ['problem_solving', 'discovery', 'learning']
          }
        ],
        accessories: [],
        encouragementPhrases: [
          "Your problem-solving skills are amazing!",
          "Keep thinking outside the box!",
          "Clever solutions come from clever minds!"
        ],
        celebrationPhrases: [
          "Fantastic! You're one smart cookie!",
          "Your cleverness knows no bounds!",
          "Brilliant work, my friend!"
        ],
        motivationalPhrases: [
          "Every problem has a solution!",
          "Think creatively and you'll find the way!",
          "Smart thinking leads to great results!"
        ],
        description: 'A clever fox who loves puzzles and creative solutions',
        backstory: 'Foxy was known as the smartest student in Forest Academy, always finding unique solutions to complex problems.',
        favoriteActivities: ['problem solving', 'riddles', 'creative writing'],
        specialAbilities: ['Problem-solving boost', 'Creative thinking', 'Logic enhancement']
      },
      {
        id: 'friendly-bear',
        name: 'Buddy',
        type: 'bear',
        personality: 'Friendly and supportive, great for motivation',
        rarity: 'common',
        unlockCondition: 'Complete 5 consecutive days of study',
        animations: [
          {
            name: 'encouraging_hug',
            type: 'encouragement',
            duration: 3000,
            frames: [
              {
                frameNumber: 1,
                position: { x: 0, y: 0 },
                rotation: 0,
                scale: 1.1,
                opacity: 1,
                expression: 'warm_smile',
                accessories: [],
                effects: [
                  {
                    type: 'hearts',
                    intensity: 6,
                    duration: 3000,
                    color: 'pink'
                  }
                ]
              }
            ],
            triggerConditions: ['encouragement_needed', 'struggle_detected'],
            soundEffect: 'warm_chuckle'
          }
        ],
        expressions: [
          {
            name: 'warm_smile',
            mood: 'encouraging',
            eyeType: 'kind',
            mouthType: 'big_smile',
            earPosition: 'relaxed',
            bodyPosture: 'open_arms',
            usageContext: ['encouragement', 'support', 'comfort']
          }
        ],
        accessories: [],
        encouragementPhrases: [
          "You're doing great! Keep it up!",
          "I'm here to support you every step!",
          "Believe in yourself - I do!"
        ],
        celebrationPhrases: [
          "Bear-y impressive work!",
          "You're absolutely amazing!",
          "Huge congratulations!"
        ],
        motivationalPhrases: [
          "Progress, not perfection!",
          "You're stronger than you think!",
          "Every step forward counts!"
        ],
        description: 'A friendly bear who provides endless support and encouragement',
        backstory: 'Buddy was the most popular student at Bear Valley School, known for helping everyone succeed.',
        favoriteActivities: ['motivation', 'support', 'celebration'],
        specialAbilities: ['Motivation boost', 'Stress relief', 'Confidence building']
      },
      {
        id: 'speedy-rabbit',
        name: 'Flash',
        type: 'rabbit',
        personality: 'Energetic and fast, perfect for quick learning',
        rarity: 'uncommon',
        unlockCondition: 'Complete 20 exercises in one day',
        animations: [
          {
            name: 'speed_boost',
            type: 'excited',
            duration: 1500,
            frames: [
              {
                frameNumber: 1,
                position: { x: -20, y: 0 },
                rotation: 0,
                scale: 1,
                opacity: 0.8,
                expression: 'energetic',
                accessories: ['running_shoes'],
                effects: [
                  {
                    type: 'bounce',
                    intensity: 10,
                    duration: 1500,
                    color: 'yellow'
                  }
                ]
              }
            ],
            triggerConditions: ['quick_completion', 'speed_challenge'],
            soundEffect: 'zoom_sound'
          }
        ],
        expressions: [
          {
            name: 'energetic',
            mood: 'excited',
            eyeType: 'wide_excited',
            mouthType: 'open_smile',
            earPosition: 'up_alert',
            bodyPosture: 'ready_to_go',
            usageContext: ['speed', 'energy', 'excitement']
          }
        ],
        accessories: [
          {
            id: 'running_shoes',
            name: 'Speedy Sneakers',
            type: 'badge',
            unlockCondition: 'Complete 50 quick exercises',
            rarity: 'uncommon',
            description: 'Lightning-fast shoes for quick learning',
            visualEffects: [
              {
                type: 'glow',
                intensity: 4,
                duration: 0,
                color: 'yellow'
              }
            ],
            statBonus: { type: 'completion_speed', value: 15 }
          }
        ],
        encouragementPhrases: [
          "Speed and accuracy - you've got both!",
          "Quick thinking, quick learning!",
          "You're on fire today!"
        ],
        celebrationPhrases: [
          "Lightning-fast success!",
          "Zoom! You did it!",
          "Speedy achievement unlocked!"
        ],
        motivationalPhrases: [
          "Fast learners go far!",
          "Quick practice makes perfect!",
          "Speed up your success!"
        ],
        description: 'An energetic rabbit who loves speed and quick thinking',
        backstory: 'Flash was the fastest student at Meadow Elementary, completing assignments in record time while maintaining high quality.',
        favoriteActivities: ['speed challenges', 'quick exercises', 'time trials'],
        specialAbilities: ['Speed boost', 'Quick recall', 'Time efficiency']
      }
    ];

    mascots.forEach(mascot => {
      this.mascots.set(mascot.id, mascot);
    });
  }

  private initializeSampleUserMascots(): void {
    const sampleUserMascot: UserMascot = {
      userId: 1,
      mascotId: 'wise-owl',
      nickname: 'Professor',
      level: 3,
      experience: 150,
      happiness: 85,
      energy: 70,
      lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      equippedAccessories: ['reading_glasses'],
      unlockedExpressions: ['focused', 'happy'],
      unlockedAnimations: ['reading', 'celebration'],
      personalityTraits: ['studious', 'encouraging', 'patient'],
      favoriteTime: 'evening',
      customization: {
        primaryColor: '#8B4513',
        secondaryColor: '#F4A460',
        eyeColor: '#FFD700',
        pattern: 'speckled',
        size: 'medium',
        voice: 'medium',
        speechBubbleStyle: 'classic'
      },
      achievements: [
        {
          id: 'first_week',
          title: 'First Week Together',
          description: 'Studied together for 7 days',
          unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          mascotLevel: 2,
          reward: 'Special celebration animation'
        }
      ],
      streakWithUser: 12
    };

    this.userMascots.set(1, sampleUserMascot);
  }

  // Progress animation methods
  createProgressAnimation(
    userId: number,
    progressType: string,
    previousValue: number,
    newValue: number,
    maxValue: number,
    context: string
  ): ProgressAnimation {
    const userMascot = this.userMascots.get(userId);
    if (!userMascot) {
      throw new Error('User mascot not found');
    }

    const animationId = `anim-${Date.now()}-${userId}`;
    const celebrationIntensity = this.calculateCelebrationIntensity(progressType, newValue - previousValue, maxValue);

    const animation: ProgressAnimation = {
      id: animationId,
      type: progressType as any,
      mascotId: userMascot.mascotId,
      userId,
      progressData: {
        previousValue,
        newValue,
        maxValue,
        progressType,
        context
      },
      animationSequence: this.generateAnimationSequence(userMascot.mascotId, celebrationIntensity),
      duration: this.calculateAnimationDuration(celebrationIntensity),
      celebrationIntensity,
      soundEffects: this.selectSoundEffects(celebrationIntensity),
      particleEffects: this.generateParticleEffects(celebrationIntensity),
      createdAt: new Date()
    };

    this.progressAnimations.set(animationId, animation);
    this.updateMascotExperience(userId, 10 + (celebrationIntensity === 'epic' ? 20 : 0));
    
    return animation;
  }

  private calculateCelebrationIntensity(
    progressType: string,
    improvement: number,
    maxValue: number
  ): 'mild' | 'moderate' | 'intense' | 'epic' {
    const percentageImprovement = (improvement / maxValue) * 100;

    if (progressType === 'level_up' || percentageImprovement >= 50) {
      return 'epic';
    } else if (percentageImprovement >= 25) {
      return 'intense';
    } else if (percentageImprovement >= 10) {
      return 'moderate';
    } else {
      return 'mild';
    }
  }

  private generateAnimationSequence(mascotId: string, intensity: string): AnimationSequence[] {
    const mascot = this.mascots.get(mascotId);
    if (!mascot) return [];

    const sequences: AnimationSequence[] = [];

    switch (intensity) {
      case 'epic':
        sequences.push(
          {
            step: 1,
            mascotAnimation: 'celebration',
            duration: 2000,
            effects: [
              { type: 'sparkles', intensity: 10, duration: 2000, color: 'gold', size: 5 },
              { type: 'confetti', intensity: 15, duration: 3000, color: 'rainbow' }
            ],
            message: mascot.celebrationPhrases[0],
            voiceLine: 'celebration_epic'
          },
          {
            step: 2,
            mascotAnimation: 'excited',
            duration: 1500,
            effects: [
              { type: 'fireworks', intensity: 8, duration: 1500, color: 'multicolor' }
            ]
          }
        );
        break;
      case 'intense':
        sequences.push({
          step: 1,
          mascotAnimation: 'celebration',
          duration: 1500,
          effects: [
            { type: 'sparkles', intensity: 6, duration: 1500, color: 'gold', size: 3 },
            { type: 'stars', intensity: 8, duration: 2000, color: 'yellow' }
          ],
          message: mascot.celebrationPhrases[1] || mascot.celebrationPhrases[0],
          voiceLine: 'celebration_intense'
        });
        break;
      case 'moderate':
        sequences.push({
          step: 1,
          mascotAnimation: 'encouragement',
          duration: 1000,
          effects: [
            { type: 'sparkles', intensity: 4, duration: 1000, color: 'blue', size: 2 }
          ],
          message: mascot.encouragementPhrases[0],
          voiceLine: 'encouragement'
        });
        break;
      default: // mild
        sequences.push({
          step: 1,
          mascotAnimation: 'idle',
          duration: 800,
          effects: [
            { type: 'glow', intensity: 2, duration: 800, color: 'green' }
          ],
          message: "Nice work!",
          voiceLine: 'positive'
        });
    }

    return sequences;
  }

  private calculateAnimationDuration(intensity: string): number {
    switch (intensity) {
      case 'epic': return 4000;
      case 'intense': return 2500;
      case 'moderate': return 1500;
      default: return 1000;
    }
  }

  private selectSoundEffects(intensity: string): string[] {
    switch (intensity) {
      case 'epic': return ['fanfare', 'celebration_cheer', 'success_bell'];
      case 'intense': return ['celebration_cheer', 'success_bell'];
      case 'moderate': return ['success_chime'];
      default: return ['positive_beep'];
    }
  }

  private generateParticleEffects(intensity: string): ParticleEffect[] {
    const effects: ParticleEffect[] = [];

    switch (intensity) {
      case 'epic':
        effects.push(
          {
            type: 'confetti',
            count: 100,
            color: ['red', 'blue', 'yellow', 'green', 'purple'],
            gravity: 0.5,
            velocity: { x: 0, y: -5 },
            lifetime: 3000,
            size: { min: 3, max: 8 }
          },
          {
            type: 'fireworks',
            count: 5,
            color: ['gold', 'silver', 'red'],
            gravity: 0.2,
            velocity: { x: 0, y: -10 },
            lifetime: 2000,
            size: { min: 10, max: 20 }
          }
        );
        break;
      case 'intense':
        effects.push({
          type: 'sparkles',
          count: 50,
          color: ['gold', 'yellow'],
          gravity: 0.3,
          velocity: { x: 0, y: -3 },
          lifetime: 2000,
          size: { min: 2, max: 5 }
        });
        break;
      case 'moderate':
        effects.push({
          type: 'stars',
          count: 20,
          color: ['blue', 'cyan'],
          gravity: 0.2,
          velocity: { x: 0, y: -2 },
          lifetime: 1500,
          size: { min: 1, max: 3 }
        });
        break;
    }

    return effects;
  }

  // Mascot interaction methods
  interactWithMascot(
    userId: number,
    interactionType: 'pet' | 'feed' | 'play' | 'study_together' | 'customize',
    duration: number = 0
  ): MascotInteraction {
    const userMascot = this.userMascots.get(userId);
    if (!userMascot) {
      throw new Error('User mascot not found');
    }

    const mascot = this.mascots.get(userMascot.mascotId);
    if (!mascot) {
      throw new Error('Mascot not found');
    }

    const interactionId = `interaction-${Date.now()}-${userId}`;
    const happinessGain = this.calculateHappinessGain(interactionType);
    const energyChange = this.calculateEnergyChange(interactionType);
    const experienceGain = this.calculateExperienceGain(interactionType, duration);

    const interaction: MascotInteraction = {
      id: interactionId,
      userId,
      mascotId: userMascot.mascotId,
      type: interactionType,
      timestamp: new Date(),
      duration,
      happinessGain,
      energyChange,
      experienceGain,
      userSatisfaction: 0, // Will be set by user feedback
      mascotResponse: this.generateMascotResponse(mascot, interactionType, userMascot.happiness)
    };

    // Update mascot stats
    userMascot.happiness = Math.min(100, userMascot.happiness + happinessGain);
    userMascot.energy = Math.max(0, Math.min(100, userMascot.energy + energyChange));
    userMascot.experience += experienceGain;
    userMascot.lastInteraction = new Date();

    // Check for level up
    if (userMascot.experience >= this.getExperienceForNextLevel(userMascot.level)) {
      this.levelUpMascot(userId);
    }

    // Store interaction
    const userInteractions = this.interactions.get(userId.toString()) || [];
    userInteractions.push(interaction);
    this.interactions.set(userId.toString(), userInteractions);

    return interaction;
  }

  private calculateHappinessGain(interactionType: string): number {
    const gains = {
      'pet': 5,
      'feed': 8,
      'play': 12,
      'study_together': 10,
      'customize': 6
    };
    return gains[interactionType] || 5;
  }

  private calculateEnergyChange(interactionType: string): number {
    const changes = {
      'pet': 2,
      'feed': 15,
      'play': -5,
      'study_together': -3,
      'customize': 0
    };
    return changes[interactionType] || 0;
  }

  private calculateExperienceGain(interactionType: string, duration: number): number {
    const baseGains = {
      'pet': 2,
      'feed': 3,
      'play': 5,
      'study_together': 8,
      'customize': 4
    };
    const baseGain = baseGains[interactionType] || 2;
    const durationBonus = Math.floor(duration / 60) * 2; // Bonus per minute
    return baseGain + durationBonus;
  }

  private generateMascotResponse(mascot: Mascot, interactionType: string, currentHappiness: number): MascotResponse {
    let animation = 'idle';
    let expression = 'happy';
    let message = 'Thanks for spending time with me!';
    let mood = 'content';

    if (currentHappiness > 80) {
      animation = 'excited';
      expression = 'very_happy';
      mood = 'excited';
    }

    switch (interactionType) {
      case 'pet':
        animation = 'contentment';
        message = 'That feels wonderful! Thank you!';
        break;
      case 'feed':
        animation = 'eating';
        message = 'Yummy! I feel much better now!';
        break;
      case 'play':
        animation = 'playing';
        message = mascot.encouragementPhrases[Math.floor(Math.random() * mascot.encouragementPhrases.length)];
        break;
      case 'study_together':
        animation = 'studying';
        message = "Let's learn together! I'm here to help!";
        break;
      case 'customize':
        animation = 'excited';
        message = 'I look amazing! Thanks for the makeover!';
        break;
    }

    return {
      animation,
      expression,
      message,
      soundEffect: `${mascot.type}_${interactionType}`,
      effects: [
        {
          type: 'hearts',
          intensity: 3,
          duration: 2000,
          color: 'pink'
        }
      ],
      mood
    };
  }

  private updateMascotExperience(userId: number, experience: number): void {
    const userMascot = this.userMascots.get(userId);
    if (userMascot) {
      userMascot.experience += experience;
      if (userMascot.experience >= this.getExperienceForNextLevel(userMascot.level)) {
        this.levelUpMascot(userId);
      }
    }
  }

  private getExperienceForNextLevel(currentLevel: number): number {
    return currentLevel * 100 + 50; // Increasing XP requirements
  }

  private levelUpMascot(userId: number): void {
    const userMascot = this.userMascots.get(userId);
    if (!userMascot) return;

    userMascot.level += 1;
    userMascot.experience = 0;

    // Create level up animation
    this.createProgressAnimation(userId, 'level_up', userMascot.level - 1, userMascot.level, 10, 'mascot_level');

    // Unlock new features based on level
    if (userMascot.level === 5) {
      // Unlock new expression or animation
    }
  }

  // Public methods
  getUserMascot(userId: number): UserMascot | undefined {
    return this.userMascots.get(userId);
  }

  getAvailableMascots(): Mascot[] {
    return Array.from(this.mascots.values());
  }

  assignMascotToUser(userId: number, mascotId: string, nickname: string): UserMascot {
    const mascot = this.mascots.get(mascotId);
    if (!mascot) {
      throw new Error('Mascot not found');
    }

    const userMascot: UserMascot = {
      userId,
      mascotId,
      nickname,
      level: 1,
      experience: 0,
      happiness: 100,
      energy: 100,
      lastInteraction: new Date(),
      equippedAccessories: [],
      unlockedExpressions: [mascot.expressions[0]?.name || 'happy'],
      unlockedAnimations: [mascot.animations[0]?.name || 'idle'],
      personalityTraits: [],
      favoriteTime: 'any',
      customization: {
        primaryColor: '#8B4513',
        secondaryColor: '#F4A460',
        eyeColor: '#FFD700',
        size: 'medium',
        voice: 'medium',
        speechBubbleStyle: 'classic'
      },
      achievements: [],
      streakWithUser: 0
    };

    this.userMascots.set(userId, userMascot);
    return userMascot;
  }

  getRecentAnimations(userId: number, limit: number = 5): ProgressAnimation[] {
    return Array.from(this.progressAnimations.values())
      .filter(anim => anim.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  getMascotInteractions(userId: number): MascotInteraction[] {
    return this.interactions.get(userId.toString()) || [];
  }

  customizeMascot(userId: number, customization: Partial<MascotCustomization>): UserMascot | null {
    const userMascot = this.userMascots.get(userId);
    if (!userMascot) return null;

    userMascot.customization = { ...userMascot.customization, ...customization };
    return userMascot;
  }

  getMascotEncouragement(userId: number, context: string): string {
    const userMascot = this.userMascots.get(userId);
    if (!userMascot) return "Keep up the great work!";

    const mascot = this.mascots.get(userMascot.mascotId);
    if (!mascot) return "You're doing amazing!";

    const phrases = mascot.encouragementPhrases;
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
}

export const mascotProgressSystem = new MascotProgressSystem();