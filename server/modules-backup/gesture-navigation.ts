// Gesture-based navigation for mobile learning
export interface GestureEvent {
  id: string;
  userId: number;
  type: 'swipe' | 'tap' | 'pinch' | 'rotate' | 'long_press' | 'double_tap';
  direction?: 'up' | 'down' | 'left' | 'right';
  coordinates: { x: number; y: number };
  pressure?: number;
  velocity?: number;
  duration: number;
  timestamp: Date;
  deviceInfo: DeviceInfo;
  context: string; // Current screen/activity
  action: GestureAction;
}

export interface DeviceInfo {
  screenWidth: number;
  screenHeight: number;
  deviceType: 'phone' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  accelerometer: boolean;
  gyroscope: boolean;
}

export interface GestureAction {
  actionType: string;
  target: string;
  parameters: { [key: string]: any };
  success: boolean;
  feedback: GestureFeedback;
}

export interface GestureFeedback {
  type: 'haptic' | 'visual' | 'audio' | 'none';
  intensity: number;
  duration: number;
  pattern?: number[];
  visualEffect?: VisualFeedback;
  audioFeedback?: AudioFeedback;
}

export interface VisualFeedback {
  type: 'ripple' | 'glow' | 'bounce' | 'shake' | 'highlight';
  color: string;
  animation: string;
  duration: number;
}

export interface AudioFeedback {
  soundType: 'click' | 'success' | 'error' | 'navigation' | 'achievement';
  volume: number;
  pitch?: number;
}

export interface GestureMapping {
  gesture: GesturePattern;
  action: string;
  context: string[];
  enabled: boolean;
  customizable: boolean;
  accessibility: AccessibilityOptions;
}

export interface GesturePattern {
  type: string;
  direction?: string;
  touches: number;
  minDistance?: number;
  maxDistance?: number;
  minVelocity?: number;
  maxVelocity?: number;
  minDuration?: number;
  maxDuration?: number;
}

export interface AccessibilityOptions {
  alternativeInputs: string[];
  voiceCommand?: string;
  keyboardShortcut?: string;
  description: string;
  screenReaderText: string;
}

export interface UserGestureProfile {
  userId: number;
  handedness: 'left' | 'right' | 'ambidextrous';
  sensitivity: number; // 0.1 to 2.0
  customGestures: GestureMapping[];
  disabledGestures: string[];
  accessibilityMode: boolean;
  largeTextMode: boolean;
  reducedMotion: boolean;
  hapticFeedback: boolean;
  audioFeedback: boolean;
  gestureHistory: GestureEvent[];
  learningProgress: GestureLearningProgress;
}

export interface GestureLearningProgress {
  totalGestures: number;
  accurateGestures: number;
  gestureAccuracy: { [gestureType: string]: number };
  improvementSuggestions: string[];
  masteredGestures: string[];
  strugglingWith: string[];
}

export interface NavigationFlow {
  id: string;
  name: string;
  steps: NavigationStep[];
  gestureSequence: GestureEvent[];
  learningContext: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completionRate: number;
}

export interface NavigationStep {
  stepNumber: number;
  instruction: string;
  expectedGesture: GesturePattern;
  visualCue: string;
  audioInstruction?: string;
  alternativeActions: string[];
  timeout: number;
  skipable: boolean;
}

export interface GestureAnalytics {
  userId: number;
  sessionId: string;
  totalGestures: number;
  accurateGestures: number;
  sessionDuration: number;
  gestureTypeDistribution: { [type: string]: number };
  errorPatterns: GestureError[];
  improvementMetrics: ImprovementMetric[];
  usabilityScore: number;
}

export interface GestureError {
  gestureType: string;
  expectedAction: string;
  actualAction: string;
  timestamp: Date;
  context: string;
  errorCategory: 'accuracy' | 'timing' | 'direction' | 'pressure';
}

export interface ImprovementMetric {
  metric: string;
  previousValue: number;
  currentValue: number;
  improvement: number;
  trend: 'improving' | 'stable' | 'declining';
}

export class GestureNavigationSystem {
  private gestureMappings: Map<string, GestureMapping> = new Map();
  private userProfiles: Map<number, UserGestureProfile> = new Map();
  private navigationFlows: Map<string, NavigationFlow> = new Map();
  private gestureEvents: Map<string, GestureEvent[]> = new Map();
  private analytics: Map<string, GestureAnalytics> = new Map();

  constructor() {
    this.initializeDefaultGestures();
    this.initializeNavigationFlows();
    this.initializeSampleProfiles();
  }

  private initializeDefaultGestures(): void {
    const defaultMappings: GestureMapping[] = [
      {
        gesture: {
          type: 'swipe',
          direction: 'right',
          touches: 1,
          minDistance: 100,
          minVelocity: 300
        },
        action: 'next_lesson',
        context: ['lesson', 'exercise', 'quiz'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_next_button', 'space_key'],
          voiceCommand: 'next',
          keyboardShortcut: 'ArrowRight',
          description: 'Swipe right to go to next lesson',
          screenReaderText: 'Navigate to next lesson'
        }
      },
      {
        gesture: {
          type: 'swipe',
          direction: 'left',
          touches: 1,
          minDistance: 100,
          minVelocity: 300
        },
        action: 'previous_lesson',
        context: ['lesson', 'exercise', 'quiz'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_back_button', 'backspace_key'],
          voiceCommand: 'back',
          keyboardShortcut: 'ArrowLeft',
          description: 'Swipe left to go to previous lesson',
          screenReaderText: 'Navigate to previous lesson'
        }
      },
      {
        gesture: {
          type: 'swipe',
          direction: 'up',
          touches: 1,
          minDistance: 150,
          minVelocity: 400
        },
        action: 'show_menu',
        context: ['dashboard', 'lesson'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_menu_button'],
          voiceCommand: 'menu',
          keyboardShortcut: 'Escape',
          description: 'Swipe up to show main menu',
          screenReaderText: 'Open main navigation menu'
        }
      },
      {
        gesture: {
          type: 'swipe',
          direction: 'down',
          touches: 1,
          minDistance: 150,
          minVelocity: 400
        },
        action: 'close_menu',
        context: ['menu_open'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_outside_menu'],
          voiceCommand: 'close',
          keyboardShortcut: 'Escape',
          description: 'Swipe down to close menu',
          screenReaderText: 'Close navigation menu'
        }
      },
      {
        gesture: {
          type: 'double_tap',
          touches: 1,
          maxDuration: 300
        },
        action: 'repeat_audio',
        context: ['listening_exercise', 'pronunciation'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_repeat_button'],
          voiceCommand: 'repeat',
          keyboardShortcut: 'r',
          description: 'Double tap to repeat audio',
          screenReaderText: 'Repeat audio content'
        }
      },
      {
        gesture: {
          type: 'long_press',
          touches: 1,
          minDuration: 800
        },
        action: 'show_definition',
        context: ['reading', 'vocabulary'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_definition_button'],
          voiceCommand: 'define',
          keyboardShortcut: 'd',
          description: 'Long press word to show definition',
          screenReaderText: 'Show word definition'
        }
      },
      {
        gesture: {
          type: 'pinch',
          touches: 2,
          minDistance: 50
        },
        action: 'zoom_text',
        context: ['reading', 'text_heavy'],
        enabled: true,
        customizable: false,
        accessibility: {
          alternativeInputs: ['text_size_buttons'],
          keyboardShortcut: 'Ctrl++',
          description: 'Pinch to zoom text',
          screenReaderText: 'Adjust text size'
        }
      },
      {
        gesture: {
          type: 'swipe',
          direction: 'up',
          touches: 2,
          minDistance: 100
        },
        action: 'bookmark_lesson',
        context: ['lesson', 'reading'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_bookmark_button'],
          voiceCommand: 'bookmark',
          keyboardShortcut: 'b',
          description: 'Two-finger swipe up to bookmark',
          screenReaderText: 'Bookmark current content'
        }
      },
      {
        gesture: {
          type: 'tap',
          touches: 3,
          maxDuration: 200
        },
        action: 'activate_mascot',
        context: ['any'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_mascot_button'],
          voiceCommand: 'mascot',
          keyboardShortcut: 'm',
          description: 'Triple tap to interact with mascot',
          screenReaderText: 'Activate learning mascot'
        }
      },
      {
        gesture: {
          type: 'rotate',
          touches: 2,
          minDistance: 45
        },
        action: 'switch_view_mode',
        context: ['dashboard', 'lesson'],
        enabled: true,
        customizable: true,
        accessibility: {
          alternativeInputs: ['tap_view_button'],
          voiceCommand: 'switch view',
          keyboardShortcut: 'v',
          description: 'Rotate to switch view mode',
          screenReaderText: 'Switch between view modes'
        }
      }
    ];

    defaultMappings.forEach(mapping => {
      const key = `${mapping.gesture.type}_${mapping.gesture.direction || 'any'}_${mapping.gesture.touches}`;
      this.gestureMappings.set(key, mapping);
    });
  }

  private initializeNavigationFlows(): void {
    const flows: NavigationFlow[] = [
      {
        id: 'lesson_navigation',
        name: 'Basic Lesson Navigation',
        steps: [
          {
            stepNumber: 1,
            instruction: 'Swipe right to go to the next lesson',
            expectedGesture: {
              type: 'swipe',
              direction: 'right',
              touches: 1,
              minDistance: 100
            },
            visualCue: 'arrow_right_animation',
            audioInstruction: 'Swipe your finger from left to right across the screen',
            alternativeActions: ['tap next button'],
            timeout: 10000,
            skipable: true
          },
          {
            stepNumber: 2,
            instruction: 'Swipe left to go back to the previous lesson',
            expectedGesture: {
              type: 'swipe',
              direction: 'left',
              touches: 1,
              minDistance: 100
            },
            visualCue: 'arrow_left_animation',
            audioInstruction: 'Swipe your finger from right to left across the screen',
            alternativeActions: ['tap back button'],
            timeout: 10000,
            skipable: true
          }
        ],
        gestureSequence: [],
        learningContext: 'navigation_tutorial',
        difficulty: 'beginner',
        estimatedTime: 60,
        completionRate: 0.95
      },
      {
        id: 'advanced_interactions',
        name: 'Advanced Learning Interactions',
        steps: [
          {
            stepNumber: 1,
            instruction: 'Double tap to repeat audio content',
            expectedGesture: {
              type: 'double_tap',
              touches: 1,
              maxDuration: 300
            },
            visualCue: 'double_tap_animation',
            audioInstruction: 'Quickly tap twice on the audio content',
            alternativeActions: ['tap repeat button'],
            timeout: 8000,
            skipable: true
          },
          {
            stepNumber: 2,
            instruction: 'Long press a word to see its definition',
            expectedGesture: {
              type: 'long_press',
              touches: 1,
              minDuration: 800
            },
            visualCue: 'long_press_animation',
            audioInstruction: 'Press and hold on any word for a moment',
            alternativeActions: ['tap and hold'],
            timeout: 12000,
            skipable: true
          },
          {
            stepNumber: 3,
            instruction: 'Triple tap to activate your learning mascot',
            expectedGesture: {
              type: 'tap',
              touches: 3,
              maxDuration: 200
            },
            visualCue: 'triple_tap_animation',
            audioInstruction: 'Tap three times quickly anywhere on the screen',
            alternativeActions: ['tap mascot button'],
            timeout: 10000,
            skipable: true
          }
        ],
        gestureSequence: [],
        learningContext: 'advanced_tutorial',
        difficulty: 'intermediate',
        estimatedTime: 180,
        completionRate: 0.78
      }
    ];

    flows.forEach(flow => {
      this.navigationFlows.set(flow.id, flow);
    });
  }

  private initializeSampleProfiles(): void {
    const sampleProfile: UserGestureProfile = {
      userId: 1,
      handedness: 'right',
      sensitivity: 1.0,
      customGestures: [],
      disabledGestures: [],
      accessibilityMode: false,
      largeTextMode: false,
      reducedMotion: false,
      hapticFeedback: true,
      audioFeedback: true,
      gestureHistory: [],
      learningProgress: {
        totalGestures: 45,
        accurateGestures: 38,
        gestureAccuracy: {
          'swipe': 0.92,
          'tap': 0.95,
          'double_tap': 0.78,
          'long_press': 0.85
        },
        improvementSuggestions: [
          'Try to maintain consistent swipe speed',
          'Double taps can be performed more quickly'
        ],
        masteredGestures: ['swipe_right', 'swipe_left', 'tap'],
        strugglingWith: ['double_tap', 'triple_tap']
      }
    };

    this.userProfiles.set(1, sampleProfile);
  }

  // Gesture processing methods
  processGestureEvent(
    userId: number,
    gestureType: string,
    coordinates: { x: number; y: number },
    direction?: string,
    pressure?: number,
    velocity?: number,
    duration?: number,
    context?: string,
    deviceInfo?: DeviceInfo
  ): GestureEvent {
    const eventId = `gesture-${Date.now()}-${userId}`;
    const action = this.determineGestureAction(gestureType, direction, context || 'unknown');
    
    const gestureEvent: GestureEvent = {
      id: eventId,
      userId,
      type: gestureType as any,
      direction: direction as any,
      coordinates,
      pressure,
      velocity,
      duration: duration || 0,
      timestamp: new Date(),
      deviceInfo: deviceInfo || this.getDefaultDeviceInfo(),
      context: context || 'unknown',
      action
    };

    // Store gesture event
    const userEvents = this.gestureEvents.get(userId.toString()) || [];
    userEvents.push(gestureEvent);
    this.gestureEvents.set(userId.toString(), userEvents);

    // Update user learning progress
    this.updateGestureLearning(userId, gestureEvent);

    return gestureEvent;
  }

  private determineGestureAction(gestureType: string, direction?: string, context?: string): GestureAction {
    const mappingKey = `${gestureType}_${direction || 'any'}_1`;
    const mapping = this.gestureMappings.get(mappingKey);

    if (mapping && mapping.enabled && (!context || mapping.context.includes(context))) {
      return {
        actionType: mapping.action,
        target: context || 'unknown',
        parameters: {},
        success: true,
        feedback: this.generateGestureFeedback(mapping.action)
      };
    }

    return {
      actionType: 'unknown',
      target: 'none',
      parameters: {},
      success: false,
      feedback: {
        type: 'visual',
        intensity: 0.3,
        duration: 200,
        visualEffect: {
          type: 'shake',
          color: 'red',
          animation: 'error_shake',
          duration: 200
        }
      }
    };
  }

  private generateGestureFeedback(actionType: string): GestureFeedback {
    const feedbackMap: { [action: string]: GestureFeedback } = {
      'next_lesson': {
        type: 'haptic',
        intensity: 0.6,
        duration: 100,
        pattern: [50, 50],
        visualEffect: {
          type: 'ripple',
          color: 'blue',
          animation: 'slide_right',
          duration: 300
        },
        audioFeedback: {
          soundType: 'navigation',
          volume: 0.7
        }
      },
      'previous_lesson': {
        type: 'haptic',
        intensity: 0.6,
        duration: 100,
        pattern: [50, 50],
        visualEffect: {
          type: 'ripple',
          color: 'blue',
          animation: 'slide_left',
          duration: 300
        },
        audioFeedback: {
          soundType: 'navigation',
          volume: 0.7
        }
      },
      'show_menu': {
        type: 'haptic',
        intensity: 0.8,
        duration: 150,
        pattern: [75, 75],
        visualEffect: {
          type: 'glow',
          color: 'green',
          animation: 'menu_appear',
          duration: 400
        },
        audioFeedback: {
          soundType: 'click',
          volume: 0.8
        }
      },
      'repeat_audio': {
        type: 'haptic',
        intensity: 0.5,
        duration: 80,
        pattern: [40, 40, 40, 40],
        visualEffect: {
          type: 'bounce',
          color: 'orange',
          animation: 'audio_pulse',
          duration: 250
        },
        audioFeedback: {
          soundType: 'success',
          volume: 0.6
        }
      },
      'activate_mascot': {
        type: 'haptic',
        intensity: 0.9,
        duration: 200,
        pattern: [60, 60, 60],
        visualEffect: {
          type: 'sparkle',
          color: 'gold',
          animation: 'mascot_appear',
          duration: 500
        },
        audioFeedback: {
          soundType: 'achievement',
          volume: 0.8
        }
      }
    };

    return feedbackMap[actionType] || {
      type: 'visual',
      intensity: 0.4,
      duration: 150,
      visualEffect: {
        type: 'highlight',
        color: 'gray',
        animation: 'simple_highlight',
        duration: 150
      }
    };
  }

  private updateGestureLearning(userId: number, gestureEvent: GestureEvent): void {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    profile.gestureHistory.push(gestureEvent);
    profile.learningProgress.totalGestures += 1;

    if (gestureEvent.action.success) {
      profile.learningProgress.accurateGestures += 1;
      
      // Update gesture-specific accuracy
      const gestureKey = gestureEvent.type;
      const currentAccuracy = profile.learningProgress.gestureAccuracy[gestureKey] || 0;
      const gestureCount = profile.gestureHistory.filter(e => e.type === gestureKey).length;
      const accurateCount = profile.gestureHistory.filter(e => e.type === gestureKey && e.action.success).length;
      
      profile.learningProgress.gestureAccuracy[gestureKey] = accurateCount / gestureCount;

      // Check for mastery (90%+ accuracy with 10+ attempts)
      if (accurateCount >= 9 && gestureCount >= 10 && !profile.learningProgress.masteredGestures.includes(gestureKey)) {
        profile.learningProgress.masteredGestures.push(gestureKey);
        profile.learningProgress.strugglingWith = profile.learningProgress.strugglingWith.filter(g => g !== gestureKey);
      }
    } else {
      // Track struggling gestures
      const gestureKey = gestureEvent.type;
      const gestureCount = profile.gestureHistory.filter(e => e.type === gestureKey).length;
      const accurateCount = profile.gestureHistory.filter(e => e.type === gestureKey && e.action.success).length;
      
      if (gestureCount >= 5 && (accurateCount / gestureCount) < 0.6) {
        if (!profile.learningProgress.strugglingWith.includes(gestureKey)) {
          profile.learningProgress.strugglingWith.push(gestureKey);
        }
      }
    }

    // Generate improvement suggestions
    this.generateImprovementSuggestions(profile);
  }

  private generateImprovementSuggestions(profile: UserGestureProfile): void {
    const suggestions: string[] = [];

    profile.learningProgress.strugglingWith.forEach(gestureType => {
      const accuracy = profile.learningProgress.gestureAccuracy[gestureType] || 0;
      
      if (gestureType === 'double_tap' && accuracy < 0.7) {
        suggestions.push('Try tapping more quickly for double taps - aim for less than 300ms between taps');
      }
      
      if (gestureType === 'swipe' && accuracy < 0.8) {
        suggestions.push('Maintain consistent speed when swiping - not too fast, not too slow');
      }
      
      if (gestureType === 'long_press' && accuracy < 0.75) {
        suggestions.push('Hold your finger down for at least 800ms for long press gestures');
      }
    });

    profile.learningProgress.improvementSuggestions = suggestions.slice(0, 3); // Keep top 3
  }

  private getDefaultDeviceInfo(): DeviceInfo {
    return {
      screenWidth: 375,
      screenHeight: 812,
      deviceType: 'phone',
      orientation: 'portrait',
      touchSupport: true,
      accelerometer: true,
      gyroscope: true
    };
  }

  // Public methods
  getUserGestureProfile(userId: number): UserGestureProfile | undefined {
    return this.userProfiles.get(userId);
  }

  createUserGestureProfile(userId: number, preferences: Partial<UserGestureProfile>): UserGestureProfile {
    const defaultProfile: UserGestureProfile = {
      userId,
      handedness: 'right',
      sensitivity: 1.0,
      customGestures: [],
      disabledGestures: [],
      accessibilityMode: false,
      largeTextMode: false,
      reducedMotion: false,
      hapticFeedback: true,
      audioFeedback: true,
      gestureHistory: [],
      learningProgress: {
        totalGestures: 0,
        accurateGestures: 0,
        gestureAccuracy: {},
        improvementSuggestions: [],
        masteredGestures: [],
        strugglingWith: []
      }
    };

    const profile = { ...defaultProfile, ...preferences };
    this.userProfiles.set(userId, profile);
    return profile;
  }

  getAvailableGestures(context?: string): GestureMapping[] {
    const gestures = Array.from(this.gestureMappings.values());
    
    if (context) {
      return gestures.filter(gesture => 
        gesture.enabled && gesture.context.includes(context)
      );
    }
    
    return gestures.filter(gesture => gesture.enabled);
  }

  getNavigationFlow(flowId: string): NavigationFlow | undefined {
    return this.navigationFlows.get(flowId);
  }

  getNavigationFlows(difficulty?: string): NavigationFlow[] {
    const flows = Array.from(this.navigationFlows.values());
    
    if (difficulty) {
      return flows.filter(flow => flow.difficulty === difficulty);
    }
    
    return flows;
  }

  updateGestureMapping(userId: number, gestureKey: string, mapping: Partial<GestureMapping>): boolean {
    const existingMapping = this.gestureMappings.get(gestureKey);
    if (!existingMapping || !existingMapping.customizable) {
      return false;
    }

    const updatedMapping = { ...existingMapping, ...mapping };
    this.gestureMappings.set(gestureKey, updatedMapping);
    
    // Update user's custom gestures
    const profile = this.userProfiles.get(userId);
    if (profile) {
      const customIndex = profile.customGestures.findIndex(g => 
        `${g.gesture.type}_${g.gesture.direction || 'any'}_${g.gesture.touches}` === gestureKey
      );
      
      if (customIndex >= 0) {
        profile.customGestures[customIndex] = updatedMapping;
      } else {
        profile.customGestures.push(updatedMapping);
      }
    }
    
    return true;
  }

  generateGestureAnalytics(userId: number, sessionId: string): GestureAnalytics {
    const profile = this.userProfiles.get(userId);
    const events = this.gestureEvents.get(userId.toString()) || [];
    
    if (!profile) {
      throw new Error('User profile not found');
    }

    const sessionEvents = events.filter(e => e.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000);
    const totalGestures = sessionEvents.length;
    const accurateGestures = sessionEvents.filter(e => e.action.success).length;

    const gestureTypeDistribution: { [type: string]: number } = {};
    sessionEvents.forEach(event => {
      gestureTypeDistribution[event.type] = (gestureTypeDistribution[event.type] || 0) + 1;
    });

    const errorPatterns: GestureError[] = sessionEvents
      .filter(e => !e.action.success)
      .map(e => ({
        gestureType: e.type,
        expectedAction: 'unknown',
        actualAction: e.action.actionType,
        timestamp: e.timestamp,
        context: e.context,
        errorCategory: 'accuracy' as any
      }));

    const analytics: GestureAnalytics = {
      userId,
      sessionId,
      totalGestures,
      accurateGestures,
      sessionDuration: sessionEvents.length > 0 ? 
        sessionEvents[sessionEvents.length - 1].timestamp.getTime() - sessionEvents[0].timestamp.getTime() : 0,
      gestureTypeDistribution,
      errorPatterns,
      improvementMetrics: [],
      usabilityScore: totalGestures > 0 ? (accurateGestures / totalGestures) * 100 : 0
    };

    this.analytics.set(sessionId, analytics);
    return analytics;
  }
}

export const gestureNavigationSystem = new GestureNavigationSystem();