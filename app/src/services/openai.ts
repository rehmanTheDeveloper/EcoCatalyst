import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface OpenAIResponse {
  content: string;
  error?: string;
}

export interface MealSuggestionResponse {
  name: string;
  description: string;
  foods: Array<{
    name: string;
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sustainabilityScore: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

/**
 * Generate a response for the diet chat assistant
 */
export const generateDietResponse = async (
  prompt: string,
  chatHistory: Array<{ content: string; sender: 'user' | 'ai' }>
): Promise<OpenAIResponse> => {
  try {
    const messages = [
      {
        role: 'system' as const,
        content: 'You are EcoDiet Assistant, an expert in sustainable nutrition and diet planning. ' +
          'Provide advice on eco-friendly food choices, sustainable meal planning, and the environmental ' +
          'impact of different foods. Focus on plant-based options, local foods, and low-carbon-footprint meals. ' +
          'Provide nutritional advice that balances environmental impact with health benefits. ' +
          'Keep responses concise and actionable, with specific food suggestions when appropriate.'
      },
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      { role: 'user' as const, content: prompt }
    ];
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });
    
    return {
      content: completion.choices[0]?.message?.content || 'I couldn\'t generate a response. Please try again.'
    };
  } catch (error) {
    console.error('Error generating diet response:', error);
    return {
      content: 'Sorry, I encountered an error while generating a response. Please try again later.',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Generate a meal suggestion
 */
export const generateMealSuggestion = async (
  mealType: string,
  preferences: string[],
  restrictions: string[]
): Promise<MealSuggestionResponse> => {
  try {
    const promptText = `Generate a sustainable ${mealType} recipe that is environmentally friendly.
      Preferences: ${preferences.join(', ')}
      Restrictions: ${restrictions.join(', ')}
      
      Provide the following details:
      - Name of the meal
      - Brief description that mentions environmental benefits
      - List of foods with serving sizes, calories, protein, carbs, fat, and sustainability score (0-100)
      - Total calories, protein, carbs, and fat
      
      Format as JSON without any additional text.`;
      
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system' as const, content: 'You are a sustainable diet expert. Respond only with JSON.' },
        { role: 'user' as const, content: promptText }
      ],
      max_tokens: 500,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    const responseText = completion.choices[0]?.message?.content || '{}';
    
    try {
      const parsedResponse = JSON.parse(responseText);
      
      return {
        name: parsedResponse.name || `Suggested ${mealType}`,
        description: parsedResponse.description || '',
        foods: parsedResponse.foods?.map((food: any) => ({
          name: food.name,
          servingSize: food.servingSize || '100g',
          calories: food.calories || 0,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0,
          sustainabilityScore: food.sustainabilityScore || 75
        })) || [],
        totalCalories: parsedResponse.totalCalories || 0,
        totalProtein: parsedResponse.totalProtein || 0,
        totalCarbs: parsedResponse.totalCarbs || 0,
        totalFat: parsedResponse.totalFat || 0
      };
    } catch (parseError) {
      console.error('Error parsing meal suggestion response:', parseError);
      throw new Error('Failed to parse meal suggestion response');
    }
  } catch (error) {
    console.error('Error generating meal suggestion:', error);
    
    return {
      name: `Suggested ${mealType}`,
      description: 'Unable to generate suggestion. Using fallback meal.',
      foods: [{
        name: 'Placeholder Food Item',
        servingSize: '100g',
        calories: 200,
        protein: 10,
        carbs: 20,
        fat: 5,
        sustainabilityScore: 80
      }],
      totalCalories: 200,
      totalProtein: 10,
      totalCarbs: 20,
      totalFat: 5
    };
  }
};

export default {
  generateDietResponse,
  generateMealSuggestion
};
