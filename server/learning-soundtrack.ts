// Personalized learning soundtrack generator
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  tempo: number; // BPM
  duration: number; // seconds
  focusLevel: 'low' | 'medium' | 'high' | 'intense';
  learningType: 'reading' | 'writing' | 'listening' | 'speaking' | 'memorization' | 'problem_solving';
  instrumentalOnly: boolean;
  energyLevel: number; // 1-10
  complexity: number; // 1-10 (lower = less distracting)
  audioUrl?: string;
  previewUrl?: string;
  tags: string[];
  binaural: boolean;
  whitenoise: boolean;
  natureSound: boolean;
  rating: number;
  timesPlayed: number;
}

export interface UserMusicProfile {
  userId: number;
  preferredGenres: string[];
  preferredMoods: string[];
  preferredTempo: { min: number; max: number };
  focusPreference: string;
  instrumentalOnly: boolean;
  volumePreference: number; // 0-100
  learningTypePreferences: { [type: string]: MusicPreference };
  timeOfDayPreferences: { [timeSlot: string]: MusicPreference };
  blacklistedTracks: string[];
  favoriteArtists: string[];
  playHistory: PlayHistoryItem[];
  currentStreak: number;
  totalListeningTime: number; // minutes
  effectivenessRatings: EffectivenessRating[];
}

export interface MusicPreference {
  genres: string[];
  tempo: { min: number; max: number };
  energyLevel: { min: number; max: number };
  complexity: { min: number; max: number };
  instrumentalOnly: boolean;
  prefersBinaural: boolean;
  prefersWhiteNoise: boolean;
  prefersNatureSounds: boolean;
}

export interface PlayHistoryItem {
  trackId: string;
  playedAt: Date;
  duration: number; // seconds actually listened
  skipped: boolean;
  learningActivity: string;
  focusRating?: number; // 1-5, how well it helped focus
  completedTask: boolean;
}

export interface EffectivenessRating {
  trackId: string;
  learningActivity: string;
  focusImprovement: number; // 1-5
  taskCompletion: number; // 1-5
  overallSatisfaction: number; // 1-5
  timeOfDay: string;
  studyDuration: number; // minutes
  distractionLevel: number; // 1-5 (lower = less distracted)
  timestamp: Date;
}

export interface Playlist {
  id: string;
  userId: number;
  name: string;
  description: string;
  tracks: string[];
  totalDuration: number; // seconds
  generatedFor: string; // learning activity
  mood: string;
  focusLevel: string;
  createdAt: Date;
  lastUsed: Date;
  timesUsed: number;
  averageRating: number;
  isPersonalized: boolean;
  adaptiveFeatures: AdaptiveFeature[];
}

export interface AdaptiveFeature {
  type: 'tempo_adjustment' | 'mood_transition' | 'break_reminder' | 'focus_boost';
  description: string;
  triggerCondition: string;
  enabled: boolean;
}

export interface StudySession {
  id: string;
  userId: number;
  playlistId: string;
  startTime: Date;
  endTime?: Date;
  plannedDuration: number; // minutes
  actualDuration: number; // minutes
  learningActivity: string;
  tasksCompleted: string[];
  focusBreaks: FocusBreak[];
  musicAdjustments: MusicAdjustment[];
  effectiveness: SessionEffectiveness;
  environmentalFactors: EnvironmentalFactor[];
}

export interface FocusBreak {
  startTime: Date;
  duration: number; // seconds
  reason: 'scheduled' | 'distraction' | 'fatigue' | 'user_initiated';
  activityDuring: string;
}

export interface MusicAdjustment {
  timestamp: Date;
  type: 'tempo' | 'volume' | 'genre' | 'track_skip';
  oldValue: any;
  newValue: any;
  reason: string;
  automaticAdjustment: boolean;
}

export interface SessionEffectiveness {
  overallFocus: number; // 1-10
  productivityScore: number; // 1-10
  musicHelpfulness: number; // 1-10
  distractionEvents: number;
  tasksCompleted: number;
  targetsMet: boolean;
  userSatisfaction: number; // 1-10
}

export interface EnvironmentalFactor {
  type: 'time_of_day' | 'ambient_noise' | 'lighting' | 'location';
  value: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface PersonalizationInsight {
  userId: number;
  category: 'genre_preference' | 'tempo_preference' | 'focus_pattern' | 'effectiveness_trend';
  insight: string;
  recommendation: string;
  confidence: number; // 0-1
  basedOnSessions: number;
  lastUpdated: Date;
}

export interface MoodDetection {
  userId: number;
  detectedMood: string;
  confidence: number;
  indicators: string[];
  timestamp: Date;
  suggestedMusic: MusicPreference;
}

export class LearningSoundtrackSystem {
  private musicTracks: Map<string, MusicTrack> = new Map();
  private userProfiles: Map<number, UserMusicProfile> = new Map();
  private playlists: Map<string, Playlist> = new Map();
  private studySessions: Map<string, StudySession> = new Map();
  private insights: Map<number, PersonalizationInsight[]> = new Map();

  constructor() {
    this.initializeMusicLibrary();
    this.initializeSampleProfiles();
  }

  private initializeMusicLibrary(): void {
    const tracks: MusicTrack[] = [
      // Classical Focus Music
      {
        id: 'classical-001',
        title: 'Piano Sonata in C Major',
        artist: 'Classical Focus Collective',
        genre: 'Classical',
        mood: 'calm',
        tempo: 72,
        duration: 480,
        focusLevel: 'high',
        learningType: 'reading',
        instrumentalOnly: true,
        energyLevel: 4,
        complexity: 3,
        tags: ['classical', 'piano', 'calm', 'focus'],
        binaural: false,
        whitenoise: false,
        natureSound: false,
        rating: 4.7,
        timesPlayed: 1250
      },
      {
        id: 'classical-002',
        title: 'String Quartet in D Minor',
        artist: 'Study Music Orchestra',
        genre: 'Classical',
        mood: 'contemplative',
        tempo: 60,
        duration: 420,
        focusLevel: 'high',
        learningType: 'writing',
        instrumentalOnly: true,
        energyLevel: 3,
        complexity: 4,
        tags: ['classical', 'strings', 'contemplative'],
        binaural: false,
        whitenoise: false,
        natureSound: false,
        rating: 4.5,
        timesPlayed: 980
      },

      // Ambient Electronic
      {
        id: 'ambient-001',
        title: 'Digital Rainfall',
        artist: 'Focus Flow',
        genre: 'Ambient Electronic',
        mood: 'peaceful',
        tempo: 45,
        duration: 600,
        focusLevel: 'medium',
        learningType: 'memorization',
        instrumentalOnly: true,
        energyLevel: 2,
        complexity: 1,
        tags: ['ambient', 'electronic', 'rain', 'peaceful'],
        binaural: false,
        whitenoise: true,
        natureSound: true,
        rating: 4.8,
        timesPlayed: 2100
      },
      {
        id: 'ambient-002',
        title: 'Synthetic Dreams',
        artist: 'Neural Networks',
        genre: 'Ambient Electronic',
        mood: 'dreamy',
        tempo: 50,
        duration: 720,
        focusLevel: 'low',
        learningType: 'listening',
        instrumentalOnly: true,
        energyLevel: 2,
        complexity: 2,
        tags: ['ambient', 'electronic', 'dreamy', 'synthetic'],
        binaural: true,
        whitenoise: false,
        natureSound: false,
        rating: 4.6,
        timesPlayed: 1560
      },

      // Lo-Fi Hip Hop
      {
        id: 'lofi-001',
        title: 'Study Café Beats',
        artist: 'Lo-Fi Learning',
        genre: 'Lo-Fi Hip Hop',
        mood: 'relaxed',
        tempo: 85,
        duration: 360,
        focusLevel: 'medium',
        learningType: 'reading',
        instrumentalOnly: true,
        energyLevel: 5,
        complexity: 2,
        tags: ['lofi', 'hiphop', 'beats', 'café'],
        binaural: false,
        whitenoise: false,
        natureSound: false,
        rating: 4.9,
        timesPlayed: 3200
      },
      {
        id: 'lofi-002',
        title: 'Midnight Study Session',
        artist: 'Chill Beats Collective',
        genre: 'Lo-Fi Hip Hop',
        mood: 'mellow',
        tempo: 75,
        duration: 300,
        focusLevel: 'medium',
        learningType: 'writing',
        instrumentalOnly: true,
        energyLevel: 4,
        complexity: 2,
        tags: ['lofi', 'midnight', 'chill', 'study'],
        binaural: false,
        whitenoise: false,
        natureSound: false,
        rating: 4.7,
        timesPlayed: 2800
      },

      // Binaural Beats
      {
        id: 'binaural-001',
        title: 'Alpha Wave Focus',
        artist: 'Brainwave Research',
        genre: 'Binaural Beats',
        mood: 'focused',
        tempo: 0, // Not applicable for binaural
        duration: 900,
        focusLevel: 'intense',
        learningType: 'problem_solving',
        instrumentalOnly: true,
        energyLevel: 6,
        complexity: 1,
        tags: ['binaural', 'alpha', 'focus', 'brainwave'],
        binaural: true,
        whitenoise: false,
        natureSound: false,
        rating: 4.4,
        timesPlayed: 890
      },
      {
        id: 'binaural-002',
        title: 'Theta Memory Enhancement',
        artist: 'Cognitive Audio',
        genre: 'Binaural Beats',
        mood: 'meditative',
        tempo: 0,
        duration: 1200,
        focusLevel: 'high',
        learningType: 'memorization',
        instrumentalOnly: true,
        energyLevel: 3,
        complexity: 1,
        tags: ['binaural', 'theta', 'memory', 'meditation'],
        binaural: true,
        whitenoise: false,
        natureSound: false,
        rating: 4.3,
        timesPlayed: 670
      },

      // Nature Sounds
      {
        id: 'nature-001',
        title: 'Forest Rain Symphony',
        artist: 'Nature Recordings',
        genre: 'Nature Sounds',
        mood: 'calming',
        tempo: 0,
        duration: 1800,
        focusLevel: 'low',
        learningType: 'reading',
        instrumentalOnly: true,
        energyLevel: 1,
        complexity: 1,
        tags: ['nature', 'rain', 'forest', 'calming'],
        binaural: false,
        whitenoise: true,
        natureSound: true,
        rating: 4.6,
        timesPlayed: 1450
      },
      {
        id: 'nature-002',
        title: 'Ocean Waves with Seagulls',
        artist: 'Coastal Sounds',
        genre: 'Nature Sounds',
        mood: 'peaceful',
        tempo: 0,
        duration: 2400,
        focusLevel: 'low',
        learningType: 'listening',
        instrumentalOnly: true,
        energyLevel: 2,
        complexity: 1,
        tags: ['nature', 'ocean', 'waves', 'peaceful'],
        binaural: false,
        whitenoise: true,
        natureSound: true,
        rating: 4.5,
        timesPlayed: 1120
      },

      // Upbeat Focus
      {
        id: 'upbeat-001',
        title: 'Energetic Piano Workout',
        artist: 'Active Study Music',
        genre: 'Instrumental Pop',
        mood: 'energetic',
        tempo: 120,
        duration: 240,
        focusLevel: 'medium',
        learningType: 'problem_solving',
        instrumentalOnly: true,
        energyLevel: 8,
        complexity: 3,
        tags: ['upbeat', 'piano', 'energetic', 'motivation'],
        binaural: false,
        whitenoise: false,
        natureSound: false,
        rating: 4.4,
        timesPlayed: 1890
      },
      {
        id: 'upbeat-002',
        title: 'Motivational Guitar Rhythms',
        artist: 'Study Drive',
        genre: 'Instrumental Rock',
        mood: 'motivational',
        tempo: 110,
        duration: 300,
        focusLevel: 'medium',
        learningType: 'speaking',
        instrumentalOnly: true,
        energyLevel: 7,
        complexity: 4,
        tags: ['guitar', 'motivational', 'rhythm', 'drive'],
        binaural: false,
        whitenoise: false,
        natureSound: false,
        rating: 4.3,
        timesPlayed: 1340
      }
    ];

    tracks.forEach(track => {
      this.musicTracks.set(track.id, track);
    });
  }

  private initializeSampleProfiles(): void {
    const sampleProfile: UserMusicProfile = {
      userId: 1,
      preferredGenres: ['Lo-Fi Hip Hop', 'Classical', 'Ambient Electronic'],
      preferredMoods: ['calm', 'relaxed', 'focused'],
      preferredTempo: { min: 60, max: 90 },
      focusPreference: 'medium',
      instrumentalOnly: true,
      volumePreference: 65,
      learningTypePreferences: {
        reading: {
          genres: ['Classical', 'Ambient Electronic'],
          tempo: { min: 50, max: 80 },
          energyLevel: { min: 2, max: 5 },
          complexity: { min: 1, max: 3 },
          instrumentalOnly: true,
          prefersBinaural: false,
          prefersWhiteNoise: true,
          prefersNatureSounds: true
        },
        writing: {
          genres: ['Lo-Fi Hip Hop', 'Classical'],
          tempo: { min: 70, max: 90 },
          energyLevel: { min: 3, max: 6 },
          complexity: { min: 1, max: 3 },
          instrumentalOnly: true,
          prefersBinaural: false,
          prefersWhiteNoise: false,
          prefersNatureSounds: false
        }
      },
      timeOfDayPreferences: {
        morning: {
          genres: ['Instrumental Pop', 'Classical'],
          tempo: { min: 80, max: 120 },
          energyLevel: { min: 5, max: 8 },
          complexity: { min: 2, max: 4 },
          instrumentalOnly: true,
          prefersBinaural: false,
          prefersWhiteNoise: false,
          prefersNatureSounds: false
        },
        evening: {
          genres: ['Lo-Fi Hip Hop', 'Ambient Electronic'],
          tempo: { min: 50, max: 80 },
          energyLevel: { min: 2, max: 5 },
          complexity: { min: 1, max: 2 },
          instrumentalOnly: true,
          prefersBinaural: true,
          prefersWhiteNoise: true,
          prefersNatureSounds: true
        }
      },
      blacklistedTracks: [],
      favoriteArtists: ['Lo-Fi Learning', 'Focus Flow'],
      playHistory: [],
      currentStreak: 7,
      totalListeningTime: 2400, // 40 hours
      effectivenessRatings: []
    };

    this.userProfiles.set(1, sampleProfile);
  }

  // Playlist generation methods
  generatePersonalizedPlaylist(
    userId: number,
    learningActivity: string,
    duration: number, // minutes
    timeOfDay: string = 'any'
  ): Playlist {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      throw new Error('User music profile not found');
    }

    const preferences = this.getPreferencesForContext(profile, learningActivity, timeOfDay);
    const selectedTracks = this.selectTracksForPlaylist(preferences, duration * 60);
    
    const playlistId = `playlist-${Date.now()}-${userId}`;
    const playlist: Playlist = {
      id: playlistId,
      userId,
      name: `${learningActivity} Focus Mix - ${new Date().toLocaleDateString()}`,
      description: `Personalized playlist for ${learningActivity} based on your preferences`,
      tracks: selectedTracks.map(t => t.id),
      totalDuration: selectedTracks.reduce((sum, t) => sum + t.duration, 0),
      generatedFor: learningActivity,
      mood: preferences.genres.includes('Classical') ? 'calm' : 'relaxed',
      focusLevel: this.determineFocusLevel(preferences),
      createdAt: new Date(),
      lastUsed: new Date(),
      timesUsed: 0,
      averageRating: 0,
      isPersonalized: true,
      adaptiveFeatures: [
        {
          type: 'tempo_adjustment',
          description: 'Gradually increases tempo during long sessions',
          triggerCondition: 'session_duration > 45_minutes',
          enabled: true
        },
        {
          type: 'break_reminder',
          description: 'Suggests breaks every 25 minutes',
          triggerCondition: 'continuous_focus > 25_minutes',
          enabled: true
        }
      ]
    };

    this.playlists.set(playlistId, playlist);
    return playlist;
  }

  private getPreferencesForContext(
    profile: UserMusicProfile,
    learningActivity: string,
    timeOfDay: string
  ): MusicPreference {
    // Combine activity preferences with time-of-day preferences
    const activityPrefs = profile.learningTypePreferences[learningActivity];
    const timePrefs = profile.timeOfDayPreferences[timeOfDay];

    if (!activityPrefs && !timePrefs) {
      // Return default preferences
      return {
        genres: profile.preferredGenres,
        tempo: profile.preferredTempo,
        energyLevel: { min: 3, max: 7 },
        complexity: { min: 1, max: 4 },
        instrumentalOnly: profile.instrumentalOnly,
        prefersBinaural: false,
        prefersWhiteNoise: false,
        prefersNatureSounds: false
      };
    }

    // Merge preferences with time-of-day taking priority
    const basePrefs = activityPrefs || {
      genres: profile.preferredGenres,
      tempo: profile.preferredTempo,
      energyLevel: { min: 3, max: 7 },
      complexity: { min: 1, max: 4 },
      instrumentalOnly: profile.instrumentalOnly,
      prefersBinaural: false,
      prefersWhiteNoise: false,
      prefersNatureSounds: false
    };

    if (timePrefs) {
      return {
        genres: [...new Set([...basePrefs.genres, ...timePrefs.genres])],
        tempo: {
          min: Math.max(basePrefs.tempo.min, timePrefs.tempo.min),
          max: Math.min(basePrefs.tempo.max, timePrefs.tempo.max)
        },
        energyLevel: {
          min: Math.max(basePrefs.energyLevel.min, timePrefs.energyLevel.min),
          max: Math.min(basePrefs.energyLevel.max, timePrefs.energyLevel.max)
        },
        complexity: basePrefs.complexity,
        instrumentalOnly: basePrefs.instrumentalOnly && timePrefs.instrumentalOnly,
        prefersBinaural: basePrefs.prefersBinaural || timePrefs.prefersBinaural,
        prefersWhiteNoise: basePrefs.prefersWhiteNoise || timePrefs.prefersWhiteNoise,
        prefersNatureSounds: basePrefs.prefersNatureSounds || timePrefs.prefersNatureSounds
      };
    }

    return basePrefs;
  }

  private selectTracksForPlaylist(preferences: MusicPreference, targetDuration: number): MusicTrack[] {
    let availableTracks = Array.from(this.musicTracks.values()).filter(track => {
      // Filter by genre
      if (!preferences.genres.includes(track.genre)) return false;
      
      // Filter by tempo (skip for binaural/nature sounds)
      if (track.tempo > 0 && (track.tempo < preferences.tempo.min || track.tempo > preferences.tempo.max)) {
        return false;
      }
      
      // Filter by energy level
      if (track.energyLevel < preferences.energyLevel.min || track.energyLevel > preferences.energyLevel.max) {
        return false;
      }
      
      // Filter by complexity
      if (track.complexity < preferences.complexity.min || track.complexity > preferences.complexity.max) {
        return false;
      }
      
      // Filter by instrumental preference
      if (preferences.instrumentalOnly && !track.instrumentalOnly) return false;
      
      return true;
    });

    // Sort by rating and popularity
    availableTracks.sort((a, b) => {
      const scoreA = a.rating * 0.7 + (a.timesPlayed / 1000) * 0.3;
      const scoreB = b.rating * 0.7 + (b.timesPlayed / 1000) * 0.3;
      return scoreB - scoreA;
    });

    // Select tracks to fill the target duration
    const selectedTracks: MusicTrack[] = [];
    let currentDuration = 0;

    while (currentDuration < targetDuration && availableTracks.length > 0) {
      const track = availableTracks.shift()!;
      selectedTracks.push(track);
      currentDuration += track.duration;
    }

    return selectedTracks;
  }

  private determineFocusLevel(preferences: MusicPreference): string {
    const avgEnergy = (preferences.energyLevel.min + preferences.energyLevel.max) / 2;
    const avgComplexity = (preferences.complexity.min + preferences.complexity.max) / 2;
    
    const focusScore = (10 - avgComplexity) * 0.6 + avgEnergy * 0.4;
    
    if (focusScore >= 8) return 'intense';
    if (focusScore >= 6) return 'high';
    if (focusScore >= 4) return 'medium';
    return 'low';
  }

  // Study session tracking
  startStudySession(
    userId: number,
    playlistId: string,
    learningActivity: string,
    plannedDuration: number
  ): StudySession {
    const sessionId = `session-${Date.now()}-${userId}`;
    
    const session: StudySession = {
      id: sessionId,
      userId,
      playlistId,
      startTime: new Date(),
      plannedDuration,
      actualDuration: 0,
      learningActivity,
      tasksCompleted: [],
      focusBreaks: [],
      musicAdjustments: [],
      effectiveness: {
        overallFocus: 0,
        productivityScore: 0,
        musicHelpfulness: 0,
        distractionEvents: 0,
        tasksCompleted: 0,
        targetsMet: false,
        userSatisfaction: 0
      },
      environmentalFactors: [
        {
          type: 'time_of_day',
          value: this.getTimeOfDay(),
          impact: 'neutral'
        }
      ]
    };

    this.studySessions.set(sessionId, session);
    return session;
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'late_night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }

  trackPlayback(
    userId: number,
    trackId: string,
    duration: number,
    skipped: boolean,
    learningActivity: string
  ): void {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    const playItem: PlayHistoryItem = {
      trackId,
      playedAt: new Date(),
      duration,
      skipped,
      learningActivity,
      completedTask: !skipped
    };

    profile.playHistory.push(playItem);
    
    // Update track play count
    const track = this.musicTracks.get(trackId);
    if (track) {
      track.timesPlayed += 1;
    }
  }

  rateTrackEffectiveness(
    userId: number,
    trackId: string,
    learningActivity: string,
    focusImprovement: number,
    taskCompletion: number,
    overallSatisfaction: number,
    studyDuration: number,
    distractionLevel: number
  ): void {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    const rating: EffectivenessRating = {
      trackId,
      learningActivity,
      focusImprovement,
      taskCompletion,
      overallSatisfaction,
      timeOfDay: this.getTimeOfDay(),
      studyDuration,
      distractionLevel,
      timestamp: new Date()
    };

    profile.effectivenessRatings.push(rating);
    this.updatePreferencesBasedOnRating(userId, rating);
  }

  private updatePreferencesBasedOnRating(userId: number, rating: EffectivenessRating): void {
    const profile = this.userProfiles.get(userId);
    const track = this.musicTracks.get(rating.trackId);
    
    if (!profile || !track) return;

    // If rating is high, reinforce preferences
    if (rating.overallSatisfaction >= 4) {
      if (!profile.preferredGenres.includes(track.genre)) {
        profile.preferredGenres.push(track.genre);
      }
      if (!profile.preferredMoods.includes(track.mood)) {
        profile.preferredMoods.push(track.mood);
      }
    }

    // If rating is low, add to blacklist or adjust preferences
    if (rating.overallSatisfaction <= 2) {
      if (!profile.blacklistedTracks.includes(rating.trackId)) {
        profile.blacklistedTracks.push(rating.trackId);
      }
    }
  }

  // Analytics and insights
  generatePersonalizationInsights(userId: number): PersonalizationInsight[] {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    const insights: PersonalizationInsight[] = [];
    
    // Analyze effectiveness ratings
    if (profile.effectivenessRatings.length >= 10) {
      const bestGenres = this.findMostEffectiveGenres(profile.effectivenessRatings);
      insights.push({
        userId,
        category: 'genre_preference',
        insight: `Your most effective genres are: ${bestGenres.join(', ')}`,
        recommendation: `Try incorporating more ${bestGenres[0]} music in your study sessions`,
        confidence: 0.8,
        basedOnSessions: profile.effectivenessRatings.length,
        lastUpdated: new Date()
      });
    }

    // Analyze tempo preferences
    const tempoInsight = this.analyzeTempoEffectiveness(profile.effectivenessRatings);
    if (tempoInsight) {
      insights.push(tempoInsight);
    }

    return insights;
  }

  private findMostEffectiveGenres(ratings: EffectivenessRating[]): string[] {
    const genreScores = new Map<string, number[]>();
    
    ratings.forEach(rating => {
      const track = this.musicTracks.get(rating.trackId);
      if (track) {
        const scores = genreScores.get(track.genre) || [];
        scores.push(rating.overallSatisfaction);
        genreScores.set(track.genre, scores);
      }
    });

    const avgScores = Array.from(genreScores.entries()).map(([genre, scores]) => ({
      genre,
      avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }));

    return avgScores
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3)
      .map(item => item.genre);
  }

  private analyzeTempoEffectiveness(ratings: EffectivenessRating[]): PersonalizationInsight | null {
    if (ratings.length < 15) return null;

    const tempoGroups = {
      slow: ratings.filter(r => {
        const track = this.musicTracks.get(r.trackId);
        return track && track.tempo > 0 && track.tempo < 70;
      }),
      medium: ratings.filter(r => {
        const track = this.musicTracks.get(r.trackId);
        return track && track.tempo >= 70 && track.tempo < 100;
      }),
      fast: ratings.filter(r => {
        const track = this.musicTracks.get(r.trackId);
        return track && track.tempo >= 100;
      })
    };

    const avgScores = Object.entries(tempoGroups).map(([tempo, group]) => ({
      tempo,
      avgScore: group.length > 0 ? group.reduce((sum, r) => sum + r.overallSatisfaction, 0) / group.length : 0,
      count: group.length
    }));

    const bestTempo = avgScores.filter(s => s.count >= 3).sort((a, b) => b.avgScore - a.avgScore)[0];
    
    if (bestTempo) {
      return {
        userId: ratings[0] ? ratings[0].timestamp.getTime() : 0, // Simplified userId extraction
        category: 'tempo_preference',
        insight: `You focus best with ${bestTempo.tempo} tempo music`,
        recommendation: `Try to include more ${bestTempo.tempo} tempo tracks in your playlists`,
        confidence: Math.min(0.9, bestTempo.count / 10),
        basedOnSessions: bestTempo.count,
        lastUpdated: new Date()
      };
    }

    return null;
  }

  // Public methods
  getUserMusicProfile(userId: number): UserMusicProfile | undefined {
    return this.userProfiles.get(userId);
  }

  createUserMusicProfile(userId: number, preferences: Partial<UserMusicProfile>): UserMusicProfile {
    const defaultProfile: UserMusicProfile = {
      userId,
      preferredGenres: ['Lo-Fi Hip Hop'],
      preferredMoods: ['relaxed'],
      preferredTempo: { min: 60, max: 90 },
      focusPreference: 'medium',
      instrumentalOnly: true,
      volumePreference: 70,
      learningTypePreferences: {},
      timeOfDayPreferences: {},
      blacklistedTracks: [],
      favoriteArtists: [],
      playHistory: [],
      currentStreak: 0,
      totalListeningTime: 0,
      effectivenessRatings: []
    };

    const profile = { ...defaultProfile, ...preferences };
    this.userProfiles.set(userId, profile);
    return profile;
  }

  getUserPlaylists(userId: number): Playlist[] {
    return Array.from(this.playlists.values())
      .filter(playlist => playlist.userId === userId)
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
  }

  getMusicTracks(filters?: {
    genre?: string;
    mood?: string;
    focusLevel?: string;
    learningType?: string;
  }): MusicTrack[] {
    let tracks = Array.from(this.musicTracks.values());

    if (filters) {
      if (filters.genre) {
        tracks = tracks.filter(t => t.genre === filters.genre);
      }
      if (filters.mood) {
        tracks = tracks.filter(t => t.mood === filters.mood);
      }
      if (filters.focusLevel) {
        tracks = tracks.filter(t => t.focusLevel === filters.focusLevel);
      }
      if (filters.learningType) {
        tracks = tracks.filter(t => t.learningType === filters.learningType);
      }
    }

    return tracks.sort((a, b) => b.rating - a.rating);
  }

  getPlaylistById(playlistId: string): Playlist | undefined {
    return this.playlists.get(playlistId);
  }

  updateUserPreferences(userId: number, updates: Partial<UserMusicProfile>): UserMusicProfile | null {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;

    Object.assign(profile, updates);
    return profile;
  }
}

export const learningSoundtrackSystem = new LearningSoundtrackSystem();