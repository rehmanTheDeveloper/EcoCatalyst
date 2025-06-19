import React, { createContext, useState, useEffect, useContext } from 'react';
import { database } from '../../services/firebase';
import { ref, onValue, set, push, remove, get, query, orderByChild, limitToLast, equalTo, startAt } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';
import { usePreferences } from '../preferences/PreferencesContext';

export interface DietPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  dietType: DietType;
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  restrictions: string[];
  preferences: string[];
  createdAt: number;
  updatedAt: number;
}

export interface MealEntry {
  id: string;
  userId: string;
  dietPlanId?: string;
  date: string; // ISO date string
  mealType: MealType;
  name: string;
  description?: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sustainabilityScore?: number; // 0-100
  carbonFootprint?: number; // in kg CO2e
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  relatedTo?: {
    type: 'meal' | 'plan' | 'food';
    id: string;
  };
}

export type DietType = 
  | 'balanced' 
  | 'vegetarian' 
  | 'vegan' 
  | 'keto' 
  | 'paleo' 
  | 'mediterranean' 
  | 'custom';

export type MealType = 
  | 'breakfast' 
  | 'lunch' 
  | 'dinner' 
  | 'snack';

interface DietContextType {
  currentPlan: DietPlan | null;
  mealEntries: MealEntry[];
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  createDietPlan: (plan: Omit<DietPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDietPlan: (id: string, updates: Partial<Omit<DietPlan, 'id' | 'userId'>>) => Promise<void>;
  deleteDietPlan: (id: string) => Promise<void>;
  addMealEntry: (meal: Omit<MealEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateMealEntry: (id: string, updates: Partial<Omit<MealEntry, 'id' | 'userId'>>) => Promise<void>;
  deleteMealEntry: (id: string) => Promise<void>;
  getMealsByDate: (date: string) => MealEntry[];
  getMealsByDateRange: (startDate: string, endDate: string) => Promise<MealEntry[]>;
  sendChatMessage: (content: string, relatedTo?: { type: 'meal' | 'plan' | 'food'; id: string }) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  generateMealSuggestion: (mealType: MealType, date: string) => Promise<MealEntry | null>;
  clearError: () => void;
}

const CURRENT_PLAN_STORAGE_KEY = 'ecocatalyst_current_diet_plan';
const MEAL_ENTRIES_STORAGE_KEY = 'ecocatalyst_meal_entries';
const CHAT_HISTORY_STORAGE_KEY = 'ecocatalyst_diet_chat_history';

export const DietContext = createContext<DietContextType>({
  currentPlan: null,
  mealEntries: [],
  chatHistory: [],
  isLoading: true,
  error: null,
  createDietPlan: async () => '',
  updateDietPlan: async () => {},
  deleteDietPlan: async () => {},
  addMealEntry: async () => '',
  updateMealEntry: async () => {},
  deleteMealEntry: async () => {},
  getMealsByDate: () => [],
  getMealsByDateRange: async () => [],
  sendChatMessage: async () => {},
  clearChatHistory: async () => {},
  generateMealSuggestion: async () => null,
  clearError: () => {},
});

export const useDiet = () => useContext(DietContext);

export const DietProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<DietPlan | null>(null);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useContext(AuthContext);
  const { preferences } = usePreferences();
  
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedPlan = await AsyncStorage.getItem(CURRENT_PLAN_STORAGE_KEY);
        if (cachedPlan) {
          setCurrentPlan(JSON.parse(cachedPlan));
        }
        
        const cachedMeals = await AsyncStorage.getItem(MEAL_ENTRIES_STORAGE_KEY);
        if (cachedMeals) {
          setMealEntries(JSON.parse(cachedMeals));
        }
        
        const cachedChat = await AsyncStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
        if (cachedChat) {
          setChatHistory(JSON.parse(cachedChat));
        }
      } catch (error) {
        console.error('Failed to load cached diet data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCachedData();
  }, []);
  
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    const userDietPlanRef = query(
      ref(database, `dietPlans/${user.uid}`),
      orderByChild('endDate'),
      startAt(new Date().toISOString().split('T')[0])
    );
    
    const planUnsubscribe = onValue(userDietPlanRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const plans = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          plans.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          
          const latestPlan = plans[0];
          setCurrentPlan(latestPlan);
          
          AsyncStorage.setItem(CURRENT_PLAN_STORAGE_KEY, JSON.stringify(latestPlan))
            .catch(err => console.error('Failed to cache current diet plan:', err));
        } else {
          setCurrentPlan(null);
        }
      } catch (error) {
        console.error('Error fetching diet plan:', error);
      }
    });
    
    const userMealsRef = query(
      ref(database, `mealEntries/${user.uid}`),
      orderByChild('date'),
      startAt(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) // Last 30 days
    );
    
    const mealsUnsubscribe = onValue(userMealsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const mealsList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          mealsList.sort((a, b) => {
            const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
            if (dateCompare !== 0) return dateCompare;
            
            const mealTypeOrder: Record<MealType, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
            return mealTypeOrder[a.mealType as MealType] - mealTypeOrder[b.mealType as MealType];
          });
          
          setMealEntries(mealsList);
          
          AsyncStorage.setItem(MEAL_ENTRIES_STORAGE_KEY, JSON.stringify(mealsList))
            .catch(err => console.error('Failed to cache meal entries:', err));
        } else {
          setMealEntries([]);
        }
      } catch (error) {
        console.error('Error fetching meal entries:', error);
      }
    });
    
    const userChatRef = query(
      ref(database, `dietChat/${user.uid}`),
      orderByChild('timestamp'),
      limitToLast(50)
    );
    
    const chatUnsubscribe = onValue(userChatRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const chatList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          chatList.sort((a, b) => a.timestamp - b.timestamp);
          
          setChatHistory(chatList);
          
          AsyncStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(chatList))
            .catch(err => console.error('Failed to cache chat history:', err));
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoading(false);
      }
    });
    
    return () => {
      planUnsubscribe();
      mealsUnsubscribe();
      chatUnsubscribe();
    };
  }, [user]);
  
  const createDietPlan = async (plan: Omit<DietPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const timestamp = Date.now();
      
      if (!user) {
        const newPlan: DietPlan = {
          id: `local_${timestamp}`,
          userId: 'anonymous',
          createdAt: timestamp,
          updatedAt: timestamp,
          ...plan
        };
        
        setCurrentPlan(newPlan);
        
        await AsyncStorage.setItem(CURRENT_PLAN_STORAGE_KEY, JSON.stringify(newPlan));
        return newPlan.id;
      }
      
      const userDietPlanRef = ref(database, `dietPlans/${user.uid}`);
      const newPlanRef = push(userDietPlanRef);
      
      const planData: Omit<DietPlan, 'id'> = {
        userId: user.uid,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...plan
      };
      
      await set(newPlanRef, planData);
      return newPlanRef.key || '';
    } catch (error) {
      console.error('Error creating diet plan:', error);
      setError('Failed to create diet plan. Please try again.');
      return '';
    }
  };
  
  const updateDietPlan = async (id: string, updates: Partial<Omit<DietPlan, 'id' | 'userId'>>): Promise<void> => {
    try {
      const timestamp = Date.now();
      
      if (!user) {
        if (currentPlan && currentPlan.id === id) {
          const updatedPlan = {
            ...currentPlan,
            ...updates,
            updatedAt: timestamp
          };
          
          setCurrentPlan(updatedPlan);
          
          await AsyncStorage.setItem(CURRENT_PLAN_STORAGE_KEY, JSON.stringify(updatedPlan));
        }
        return;
      }
      
      const planRef = ref(database, `dietPlans/${user.uid}/${id}`);
      
      const snapshot = await get(planRef);
      const currentData = snapshot.val();
      
      if (!currentData) {
        throw new Error('Diet plan not found');
      }
      
      await set(planRef, {
        ...currentData,
        ...updates,
        updatedAt: timestamp
      });
    } catch (error) {
      console.error('Error updating diet plan:', error);
      setError('Failed to update diet plan. Please try again.');
    }
  };
  
  const deleteDietPlan = async (id: string): Promise<void> => {
    try {
      if (!user) {
        if (currentPlan && currentPlan.id === id) {
          setCurrentPlan(null);
          await AsyncStorage.removeItem(CURRENT_PLAN_STORAGE_KEY);
        }
        return;
      }
      
      const planRef = ref(database, `dietPlans/${user.uid}/${id}`);
      await remove(planRef);
    } catch (error) {
      console.error('Error deleting diet plan:', error);
      setError('Failed to delete diet plan. Please try again.');
    }
  };
  
  const addMealEntry = async (meal: Omit<MealEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const timestamp = Date.now();
      
      if (!user) {
        const newMeal: MealEntry = {
          id: `local_${timestamp}`,
          userId: 'anonymous',
          createdAt: timestamp,
          updatedAt: timestamp,
          ...meal
        };
        
        const updatedMeals = [newMeal, ...mealEntries];
        setMealEntries(updatedMeals);
        
        await AsyncStorage.setItem(MEAL_ENTRIES_STORAGE_KEY, JSON.stringify(updatedMeals));
        return newMeal.id;
      }
      
      const userMealsRef = ref(database, `mealEntries/${user.uid}`);
      const newMealRef = push(userMealsRef);
      
      const mealData: Omit<MealEntry, 'id'> = {
        userId: user.uid,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...meal
      };
      
      await set(newMealRef, mealData);
      return newMealRef.key || '';
    } catch (error) {
      console.error('Error adding meal entry:', error);
      setError('Failed to save meal entry. Please try again.');
      return '';
    }
  };
  
  const updateMealEntry = async (id: string, updates: Partial<Omit<MealEntry, 'id' | 'userId'>>): Promise<void> => {
    try {
      const timestamp = Date.now();
      
      if (!user) {
        const updatedMeals = mealEntries.map(meal => 
          meal.id === id ? { ...meal, ...updates, updatedAt: timestamp } : meal
        );
        
        setMealEntries(updatedMeals);
        
        await AsyncStorage.setItem(MEAL_ENTRIES_STORAGE_KEY, JSON.stringify(updatedMeals));
        return;
      }
      
      const mealRef = ref(database, `mealEntries/${user.uid}/${id}`);
      
      const snapshot = await get(mealRef);
      const currentData = snapshot.val();
      
      if (!currentData) {
        throw new Error('Meal entry not found');
      }
      
      await set(mealRef, {
        ...currentData,
        ...updates,
        updatedAt: timestamp
      });
    } catch (error) {
      console.error('Error updating meal entry:', error);
      setError('Failed to update meal entry. Please try again.');
    }
  };
  
  const deleteMealEntry = async (id: string): Promise<void> => {
    try {
      if (!user) {
        const updatedMeals = mealEntries.filter(meal => meal.id !== id);
        
        setMealEntries(updatedMeals);
        
        await AsyncStorage.setItem(MEAL_ENTRIES_STORAGE_KEY, JSON.stringify(updatedMeals));
        return;
      }
      
      const mealRef = ref(database, `mealEntries/${user.uid}/${id}`);
      await remove(mealRef);
    } catch (error) {
      console.error('Error deleting meal entry:', error);
      setError('Failed to delete meal entry. Please try again.');
    }
  };
  
  const getMealsByDate = (date: string): MealEntry[] => {
    return mealEntries.filter(meal => meal.date === date);
  };
  
  const getMealsByDateRange = async (startDate: string, endDate: string): Promise<MealEntry[]> => {
    try {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + (24 * 60 * 60 * 1000 - 1); // End of the day
      
      return mealEntries.filter(meal => {
        const mealTime = new Date(meal.date).getTime();
        return mealTime >= start && mealTime <= end;
      });
    } catch (error) {
      console.error('Error getting meals by date range:', error);
      setError('Failed to get meal data for the selected date range.');
      return [];
    }
  };
  
  const sendChatMessage = async (content: string, relatedTo?: { type: 'meal' | 'plan' | 'food'; id: string }): Promise<void> => {
    try {
      const timestamp = Date.now();
      
      const userMessage: ChatMessage = {
        id: `user_${timestamp}`,
        userId: user?.uid || 'anonymous',
        content,
        sender: 'user',
        timestamp,
        ...(relatedTo ? { relatedTo } : {}),
      };
      
      const updatedChat = [...chatHistory, userMessage];
      setChatHistory(updatedChat);
      setIsLoading(true);
      
      if (user) {
        const userChatRef = ref(database, `dietChat/${user.uid}`);
        const newMessageRef = push(userChatRef);
        
        await set(newMessageRef, {
          userId: user.uid,
          content,
          sender: 'user',
          timestamp,
          ...(relatedTo ? { relatedTo } : {}),
        });
      }
      
      const openAIHistory = chatHistory.slice(-10).map(msg => ({
        content: msg.content,
        sender: msg.sender
      }));
      
      import('../../services/openai').then(async ({ generateDietResponse }) => {
        try {
          const aiResponseData = await generateDietResponse(content, openAIHistory);
          
          const aiResponse: ChatMessage = {
            id: `ai_${timestamp + 1}`,
            userId: user?.uid || 'anonymous',
            content: aiResponseData.content,
            sender: 'ai',
            timestamp: timestamp + 1,
            ...(relatedTo ? { relatedTo } : {}),
          };
          
          const finalChat = [...updatedChat, aiResponse];
          setChatHistory(finalChat);
          
          if (user) {
            const userChatRef = ref(database, `dietChat/${user.uid}`);
            const aiMessageRef = push(userChatRef);
            
            await set(aiMessageRef, {
              userId: user.uid,
              content: aiResponse.content,
              sender: 'ai',
              timestamp: aiResponse.timestamp,
              ...(relatedTo ? { relatedTo } : {}),
            });
          }
          
          await AsyncStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(finalChat));
        } catch (error) {
          console.error('Error getting AI response:', error);
          setError('Failed to get AI response. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }).catch(error => {
        console.error('Error importing OpenAI service:', error);
        setError('Failed to load AI service. Please try again.');
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error sending chat message:', error);
      setError('Failed to send message. Please try again.');
      setIsLoading(false);
    }
  };
  
  const clearChatHistory = async (): Promise<void> => {
    try {
      setChatHistory([]);
      await AsyncStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
      
      if (user) {
        const userChatRef = ref(database, `dietChat/${user.uid}`);
        await remove(userChatRef);
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
      setError('Failed to clear chat history. Please try again.');
    }
  };
  
  const generateMealSuggestion = async (mealType: MealType, date: string): Promise<MealEntry | null> => {
    try {
      setIsLoading(true);
      const timestamp = Date.now();
      const mealId = `suggestion_${timestamp}`;
      
      const preferences = currentPlan?.preferences || [];
      const restrictions = currentPlan?.restrictions || [];
      
      try {
        const { generateMealSuggestion } = await import('../../services/openai');
        const mealData = await generateMealSuggestion(
          mealType,
          preferences,
          restrictions
        );
        
        const suggestion: MealEntry = {
          id: mealId,
          userId: user?.uid || 'anonymous',
          date,
          mealType,
          name: mealData.name,
          description: mealData.description,
          foods: mealData.foods.map(food => ({
            id: `food_${Math.random().toString(36).substring(2, 9)}`,
            name: food.name,
            servingSize: food.servingSize,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            sustainabilityScore: food.sustainabilityScore || 80
          })),
          totalCalories: mealData.totalCalories,
          totalProtein: mealData.totalProtein,
          totalCarbs: mealData.totalCarbs,
          totalFat: mealData.totalFat,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        return suggestion;
      } catch (error) {
        console.error('Error with OpenAI meal generation:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error generating meal suggestion:', error);
      setError('Failed to generate meal suggestion. Please try again.');
      setIsLoading(false);
      return null;
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  const value = {
    currentPlan,
    mealEntries,
    chatHistory,
    isLoading,
    error,
    createDietPlan,
    updateDietPlan,
    deleteDietPlan,
    addMealEntry,
    updateMealEntry,
    deleteMealEntry,
    getMealsByDate,
    getMealsByDateRange,
    sendChatMessage,
    clearChatHistory,
    generateMealSuggestion,
    clearError,
  };
  
  return (
    <DietContext.Provider value={value}>
      {children}
    </DietContext.Provider>
  );
};
