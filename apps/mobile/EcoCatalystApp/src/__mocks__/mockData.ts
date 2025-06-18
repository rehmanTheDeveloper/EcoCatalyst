
export const mockUsers = [
  {
    id: 'user1',
    email: 'user1@example.com',
    displayName: 'Test User 1',
    photoURL: 'https://example.com/user1.jpg',
    createdAt: new Date('2023-01-01').toISOString(),
  },
  {
    id: 'user2',
    email: 'user2@example.com',
    displayName: 'Test User 2',
    photoURL: 'https://example.com/user2.jpg',
    createdAt: new Date('2023-02-01').toISOString(),
  },
];

export const mockProducts = [
  {
    id: 'product1',
    name: 'Eco-Friendly Water Bottle',
    barcode: '123456789012',
    category: 'Household',
    sustainabilityScore: 85,
    carbonFootprint: 2.3,
    imageUrl: 'https://example.com/bottle.jpg',
    manufacturer: 'Green Products Inc.',
    materials: ['Recycled Plastic', 'Bamboo'],
    recyclable: true,
    biodegradable: false,
    certifications: ['FSC Certified', 'Carbon Neutral'],
  },
  {
    id: 'product2',
    name: 'Organic Cotton T-Shirt',
    barcode: '234567890123',
    category: 'Clothing',
    sustainabilityScore: 78,
    carbonFootprint: 5.1,
    imageUrl: 'https://example.com/tshirt.jpg',
    manufacturer: 'Eco Apparel',
    materials: ['Organic Cotton'],
    recyclable: false,
    biodegradable: true,
    certifications: ['GOTS Certified', 'Fair Trade'],
  },
  {
    id: 'product3',
    name: 'Conventional Plastic Bottle',
    barcode: '345678901234',
    category: 'Household',
    sustainabilityScore: 25,
    carbonFootprint: 12.7,
    imageUrl: 'https://example.com/plastic-bottle.jpg',
    manufacturer: 'Standard Products Inc.',
    materials: ['PET Plastic'],
    recyclable: true,
    biodegradable: false,
    certifications: [],
  },
];

export const mockAlternatives = [
  {
    id: 'alt1',
    originalProductId: 'product3',
    alternativeProductId: 'product1',
    improvementPercentage: 70,
    reasonsForRecommendation: [
      'Lower carbon footprint',
      'Made from recycled materials',
      'Multiple environmental certifications',
    ],
  },
];

export const mockCarbonFootprint = [
  {
    userId: 'user1',
    date: '2023-03-01',
    totalFootprint: 12.5,
    categories: {
      food: 5.2,
      transport: 4.8,
      household: 2.5,
    },
    activities: [
      {
        id: 'activity1',
        type: 'purchase',
        productId: 'product1',
        quantity: 1,
        footprint: 2.3,
        timestamp: new Date('2023-03-01T10:30:00').toISOString(),
      },
      {
        id: 'activity2',
        type: 'transport',
        mode: 'car',
        distance: 15,
        footprint: 4.8,
        timestamp: new Date('2023-03-01T14:45:00').toISOString(),
      },
    ],
  },
  {
    userId: 'user1',
    date: '2023-03-02',
    totalFootprint: 9.7,
    categories: {
      food: 4.1,
      transport: 3.2,
      household: 2.4,
    },
    activities: [
      {
        id: 'activity3',
        type: 'purchase',
        productId: 'product2',
        quantity: 1,
        footprint: 5.1,
        timestamp: new Date('2023-03-02T09:15:00').toISOString(),
      },
    ],
  },
];

export const mockDietPlans = [
  {
    id: 'diet1',
    userId: 'user1',
    name: 'Low Carbon Vegetarian Plan',
    carbonFootprint: 3.2,
    meals: [
      {
        id: 'meal1',
        type: 'breakfast',
        name: 'Avocado Toast with Local Vegetables',
        ingredients: ['Whole grain bread', 'Avocado', 'Tomatoes', 'Spinach'],
        carbonFootprint: 0.8,
        nutritionalInfo: {
          calories: 320,
          protein: 12,
          carbs: 42,
          fat: 14,
        },
      },
      {
        id: 'meal2',
        type: 'lunch',
        name: 'Seasonal Vegetable Soup with Beans',
        ingredients: ['Carrots', 'Celery', 'Onions', 'Beans', 'Vegetable broth'],
        carbonFootprint: 1.1,
        nutritionalInfo: {
          calories: 280,
          protein: 15,
          carbs: 38,
          fat: 6,
        },
      },
      {
        id: 'meal3',
        type: 'dinner',
        name: 'Lentil and Mushroom Stew',
        ingredients: ['Lentils', 'Mushrooms', 'Carrots', 'Onions', 'Garlic', 'Herbs'],
        carbonFootprint: 1.3,
        nutritionalInfo: {
          calories: 350,
          protein: 18,
          carbs: 45,
          fat: 8,
        },
      },
    ],
  },
];

export const mockAchievements = [
  {
    id: 'achievement1',
    name: 'Carbon Saver',
    description: 'Reduce your carbon footprint by 10%',
    icon: 'eco',
    points: 100,
    unlockedAt: new Date('2023-03-15').toISOString(),
  },
  {
    id: 'achievement2',
    name: 'Scan Master',
    description: 'Scan 50 products',
    icon: 'qr_code_scanner',
    points: 200,
    unlockedAt: null,
    progress: 32,
    total: 50,
  },
  {
    id: 'achievement3',
    name: 'Eco Shopper',
    description: 'Choose eco-friendly alternatives 20 times',
    icon: 'shopping_bag',
    points: 150,
    unlockedAt: null,
    progress: 12,
    total: 20,
  },
];

export const mockUserProgress = {
  userId: 'user1',
  level: 5,
  points: 750,
  totalCarbonSaved: 125.3,
  productsScanned: 32,
  ecoAlternativesChosen: 12,
  streakDays: 7,
  lastActive: new Date('2023-03-20').toISOString(),
};
