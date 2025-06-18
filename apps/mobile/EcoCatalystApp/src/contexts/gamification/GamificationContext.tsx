import React, { createContext, useState, useEffect, useContext } from 'react';
import { database } from '../../services/firebase';
import { ref, onValue, set, push, remove, get, query, orderByChild, limitToLast, equalTo } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  points: number;
  requirements: AchievementRequirement[];
  isSecret: boolean;
  createdAt: number;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  completedAt: number;
  progress: number; // 0-100%
}

export interface AchievementRequirement {
  type: RequirementType;
  target: number;
  description: string;
}

export interface UserStats {
  id: string;
  userId: string;
  totalPoints: number;
  level: number;
  productsScanned: number;
  ecoAlternativesUsed: number;
  carbonSaved: number; // in kg CO2e
  consecutiveDays: number;
  lastActive: number; // timestamp
  updatedAt: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  level: number;
}

export type AchievementCategory = 
  | 'scanner' 
  | 'footprint' 
  | 'diet' 
  | 'community' 
  | 'streak';

export type RequirementType = 
  | 'scan_products' 
  | 'use_alternatives' 
  | 'reduce_carbon' 
  | 'complete_diet_days' 
  | 'consecutive_days' 
  | 'share_results';

interface GamificationContextType {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  userStats: UserStats | null;
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  checkAchievements: () => Promise<UserAchievement[]>;
  updateUserStats: (updates: Partial<Omit<UserStats, 'id' | 'userId' | 'updatedAt'>>) => Promise<void>;
  getAchievementById: (id: string) => Achievement | null;
  getAchievementsByCategory: (category: AchievementCategory) => Achievement[];
  getCompletedAchievements: () => UserAchievement[];
  getInProgressAchievements: () => { achievement: Achievement; userAchievement: UserAchievement }[];
  getLeaderboard: (limit?: number) => Promise<LeaderboardEntry[]>;
  recordActivity: (activityType: RequirementType, value: number) => Promise<void>;
  clearError: () => void;
}

const ACHIEVEMENTS_STORAGE_KEY = 'ecocatalyst_achievements';
const USER_ACHIEVEMENTS_STORAGE_KEY = 'ecocatalyst_user_achievements';
const USER_STATS_STORAGE_KEY = 'ecocatalyst_user_stats';

export const GamificationContext = createContext<GamificationContextType>({
  achievements: [],
  userAchievements: [],
  userStats: null,
  leaderboard: [],
  isLoading: true,
  error: null,
  checkAchievements: async () => [],
  updateUserStats: async () => {},
  getAchievementById: () => null,
  getAchievementsByCategory: () => [],
  getCompletedAchievements: () => [],
  getInProgressAchievements: () => [],
  getLeaderboard: async () => [],
  recordActivity: async () => {},
  clearError: () => {},
});

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        if (cachedAchievements) {
          setAchievements(JSON.parse(cachedAchievements));
        }
        
        const cachedUserAchievements = await AsyncStorage.getItem(USER_ACHIEVEMENTS_STORAGE_KEY);
        if (cachedUserAchievements) {
          setUserAchievements(JSON.parse(cachedUserAchievements));
        }
        
        const cachedUserStats = await AsyncStorage.getItem(USER_STATS_STORAGE_KEY);
        if (cachedUserStats) {
          setUserStats(JSON.parse(cachedUserStats));
        }
      } catch (error) {
        console.error('Failed to load cached gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCachedData();
  }, []);
  
  useEffect(() => {
    setIsLoading(true);
    
    const achievementsRef = ref(database, 'achievements');
    const unsubscribe = onValue(achievementsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const achievementsList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          setAchievements(achievementsList);
          
          AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievementsList))
            .catch(err => console.error('Failed to cache achievements:', err));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setError('Failed to fetch achievements. Please try again later.');
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Database error:', error);
      setError('Database connection error. Please check your internet connection.');
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    const userAchievementsRef = ref(database, `userAchievements/${user.uid}`);
    const achievementsUnsubscribe = onValue(userAchievementsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const userAchievementsList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          setUserAchievements(userAchievementsList);
          
          AsyncStorage.setItem(USER_ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(userAchievementsList))
            .catch(err => console.error('Failed to cache user achievements:', err));
        } else {
          setUserAchievements([]);
        }
      } catch (error) {
        console.error('Error fetching user achievements:', error);
      }
    });
    
    const userStatsRef = ref(database, `userStats/${user.uid}`);
    const statsUnsubscribe = onValue(userStatsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const stats = {
            id: user.uid,
            ...data
          };
          
          setUserStats(stats);
          
          AsyncStorage.setItem(USER_STATS_STORAGE_KEY, JSON.stringify(stats))
            .catch(err => console.error('Failed to cache user stats:', err));
        } else {
          const initialStats: UserStats = {
            id: user.uid,
            userId: user.uid,
            totalPoints: 0,
            level: 1,
            productsScanned: 0,
            ecoAlternativesUsed: 0,
            carbonSaved: 0,
            consecutiveDays: 0,
            lastActive: Date.now(),
            updatedAt: Date.now()
          };
          
          setUserStats(initialStats);
          
          set(userStatsRef, {
            userId: initialStats.userId,
            totalPoints: initialStats.totalPoints,
            level: initialStats.level,
            productsScanned: initialStats.productsScanned,
            ecoAlternativesUsed: initialStats.ecoAlternativesUsed,
            carbonSaved: initialStats.carbonSaved,
            consecutiveDays: initialStats.consecutiveDays,
            lastActive: initialStats.lastActive,
            updatedAt: initialStats.updatedAt
          });
          
          AsyncStorage.setItem(USER_STATS_STORAGE_KEY, JSON.stringify(initialStats))
            .catch(err => console.error('Failed to cache initial user stats:', err));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setIsLoading(false);
      }
    });
    
    return () => {
      achievementsUnsubscribe();
      statsUnsubscribe();
    };
  }, [user]);
  
  const checkAchievements = async (): Promise<UserAchievement[]> => {
    try {
      if (!user || !userStats) return [];
      
      const newlyCompleted: UserAchievement[] = [];
      const timestamp = Date.now();
      
      for (const achievement of achievements) {
        const existingAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
        if (existingAchievement && existingAchievement.progress === 100) continue;
        
        let allRequirementsMet = true;
        let totalProgress = 0;
        
        for (const requirement of achievement.requirements) {
          let progress = 0;
          
          switch (requirement.type) {
            case 'scan_products':
              progress = Math.min(100, (userStats.productsScanned / requirement.target) * 100);
              break;
            case 'use_alternatives':
              progress = Math.min(100, (userStats.ecoAlternativesUsed / requirement.target) * 100);
              break;
            case 'reduce_carbon':
              progress = Math.min(100, (userStats.carbonSaved / requirement.target) * 100);
              break;
            case 'consecutive_days':
              progress = Math.min(100, (userStats.consecutiveDays / requirement.target) * 100);
              break;
            default:
              progress = 0;
          }
          
          totalProgress += progress / achievement.requirements.length;
          
          if (progress < 100) {
            allRequirementsMet = false;
          }
        }
        
        totalProgress = Math.round(totalProgress);
        
        if (existingAchievement) {
          if (totalProgress > existingAchievement.progress) {
            const updatedAchievement = {
              ...existingAchievement,
              progress: totalProgress,
              completedAt: allRequirementsMet ? timestamp : 0
            };
            
            if (user) {
              const achievementRef = ref(database, `userAchievements/${user.uid}/${existingAchievement.id}`);
              await set(achievementRef, updatedAchievement);
            }
            
            setUserAchievements(prev => 
              prev.map(ua => ua.id === existingAchievement.id ? updatedAchievement : ua)
            );
            
            if (allRequirementsMet) {
              newlyCompleted.push(updatedAchievement);
              
              await updateUserStats({
                totalPoints: (userStats.totalPoints || 0) + achievement.points
              });
            }
          }
        } else if (totalProgress > 0) {
          const newUserAchievement: UserAchievement = {
            id: `${user.uid}_${achievement.id}`,
            userId: user.uid,
            achievementId: achievement.id,
            completedAt: allRequirementsMet ? timestamp : 0,
            progress: totalProgress
          };
          
          if (user) {
            const userAchievementsRef = ref(database, `userAchievements/${user.uid}`);
            const newAchievementRef = push(userAchievementsRef);
            await set(newAchievementRef, newUserAchievement);
          }
          
          setUserAchievements(prev => [...prev, newUserAchievement]);
          
          if (allRequirementsMet) {
            newlyCompleted.push(newUserAchievement);
            
            await updateUserStats({
              totalPoints: (userStats.totalPoints || 0) + achievement.points
            });
          }
        }
      }
      
      return newlyCompleted;
    } catch (error) {
      console.error('Error checking achievements:', error);
      setError('Failed to check achievements. Please try again.');
      return [];
    }
  };
  
  const updateUserStats = async (updates: Partial<Omit<UserStats, 'id' | 'userId' | 'updatedAt'>>): Promise<void> => {
    try {
      const timestamp = Date.now();
      
      if (!user) {
        const updatedStats = userStats ? {
          ...userStats,
          ...updates,
          updatedAt: timestamp
        } : null;
        
        if (updatedStats) {
          setUserStats(updatedStats);
          
          await AsyncStorage.setItem(USER_STATS_STORAGE_KEY, JSON.stringify(updatedStats));
        }
        return;
      }
      
      const statsRef = ref(database, `userStats/${user.uid}`);
      
      const snapshot = await get(statsRef);
      const currentData = snapshot.val();
      
      const updatedData = {
        ...(currentData || {
          userId: user.uid,
          totalPoints: 0,
          level: 1,
          productsScanned: 0,
          ecoAlternativesUsed: 0,
          carbonSaved: 0,
          consecutiveDays: 0,
          lastActive: timestamp
        }),
        ...updates,
        updatedAt: timestamp
      };
      
      if (updates.totalPoints !== undefined) {
        updatedData.level = Math.max(1, Math.floor(updatedData.totalPoints / 100) + 1);
      }
      
      if (updates.lastActive !== undefined) {
        const lastActiveDate = new Date(currentData?.lastActive || 0);
        const newActiveDate = new Date(updates.lastActive);
        
        if (newActiveDate.getTime() - lastActiveDate.getTime() > 48 * 60 * 60 * 1000) {
          updatedData.consecutiveDays = 1;
        } 
        else if (
          newActiveDate.getTime() - lastActiveDate.getTime() > 20 * 60 * 60 * 1000 &&
          newActiveDate.getDate() !== lastActiveDate.getDate()
        ) {
          updatedData.consecutiveDays = (currentData?.consecutiveDays || 0) + 1;
        }
      }
      
      await set(statsRef, updatedData);
      
      setUserStats({
        id: user.uid,
        ...updatedData
      });
      
      await checkAchievements();
    } catch (error) {
      console.error('Error updating user stats:', error);
      setError('Failed to update user stats. Please try again.');
    }
  };
  
  const getAchievementById = (id: string): Achievement | null => {
    return achievements.find(a => a.id === id) || null;
  };
  
  const getAchievementsByCategory = (category: AchievementCategory): Achievement[] => {
    return achievements.filter(a => a.category === category);
  };
  
  const getCompletedAchievements = (): UserAchievement[] => {
    return userAchievements.filter(ua => ua.progress === 100);
  };
  
  const getInProgressAchievements = (): { achievement: Achievement; userAchievement: UserAchievement }[] => {
    return userAchievements
      .filter(ua => ua.progress > 0 && ua.progress < 100)
      .map(ua => {
        const achievement = getAchievementById(ua.achievementId);
        if (!achievement) return null;
        return { achievement, userAchievement: ua };
      })
      .filter((item): item is { achievement: Achievement; userAchievement: UserAchievement } => item !== null);
  };
  
  const getLeaderboard = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    try {
      if (leaderboard.length > 0 && limit <= leaderboard.length) {
        return leaderboard.slice(0, limit);
      }
      
      const leaderboardRef = query(
        ref(database, 'userStats'),
        orderByChild('totalPoints'),
        limitToLast(limit)
      );
      
      const snapshot = await get(leaderboardRef);
      const data = snapshot.val();
      
      if (data) {
        const entries = Object.keys(data).map(key => ({
          userId: key,
          displayName: data[key].displayName || 'Anonymous',
          photoURL: data[key].photoURL,
          totalPoints: data[key].totalPoints || 0,
          level: data[key].level || 1
        }));
        
        entries.sort((a, b) => b.totalPoints - a.totalPoints);
        
        setLeaderboard(entries);
        return entries;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      setError('Failed to get leaderboard. Please try again.');
      return [];
    }
  };
  
  const recordActivity = async (activityType: RequirementType, value: number): Promise<void> => {
    try {
      if (!user || !userStats) return;
      
      const updates: Partial<Omit<UserStats, 'id' | 'userId' | 'updatedAt'>> = {
        lastActive: Date.now()
      };
      
      switch (activityType) {
        case 'scan_products':
          updates.productsScanned = (userStats.productsScanned || 0) + value;
          break;
        case 'use_alternatives':
          updates.ecoAlternativesUsed = (userStats.ecoAlternativesUsed || 0) + value;
          break;
        case 'reduce_carbon':
          updates.carbonSaved = (userStats.carbonSaved || 0) + value;
          break;
      }
      
      await updateUserStats(updates);
    } catch (error) {
      console.error('Error recording activity:', error);
      setError('Failed to record activity. Please try again.');
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  const value = {
    achievements,
    userAchievements,
    userStats,
    leaderboard,
    isLoading,
    error,
    checkAchievements,
    updateUserStats,
    getAchievementById,
    getAchievementsByCategory,
    getCompletedAchievements,
    getInProgressAchievements,
    getLeaderboard,
    recordActivity,
    clearError,
  };
  
  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
