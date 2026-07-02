// In-memory mock database fallback for fitnessArena

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  membership: {
    plan: string;
    status: string;
    startDate?: Date;
    endDate?: Date;
  };
  createdAt: Date;
}

export interface MockWorkout {
  _id: string;
  title: string;
  description: string;
  trainer: string;
  duration: string;
  intensity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beast Level';
  schedule: string;
  capacity: number;
  bookedCount: number;
  category: string;
  createdAt: Date;
}

export const MOCK_USERS: MockUser[] = [];

export const MOCK_WORKOUTS: MockWorkout[] = [
  {
    _id: 'w1',
    title: 'Beast Mode Powerlifting',
    description: 'Master the deadlift, squat, and bench press under high-intensity guidance.',
    trainer: 'Marcus Steele',
    duration: '60 mins',
    intensity: 'Beast Level',
    schedule: 'Mon, Wed, Fri - 6:00 AM',
    capacity: 12,
    bookedCount: 8,
    category: 'Powerlifting',
    createdAt: new Date(),
  },
  {
    _id: 'w2',
    title: 'Hypertrophy Iron Sculpt',
    description: 'Focused training targeting pure muscle growth and symmetry using dumbbells and barbells.',
    trainer: 'Elena Rostova',
    duration: '50 mins',
    intensity: 'Intermediate',
    schedule: 'Tue, Thu, Sat - 8:00 AM',
    capacity: 20,
    bookedCount: 14,
    category: 'Strength',
    createdAt: new Date(),
  },
  {
    _id: 'w3',
    title: 'Viking Core & HIIT',
    description: 'Explosive functional circuits that spike heart rate and build rock-solid core endurance.',
    trainer: 'Thorsten Odinson',
    duration: '45 mins',
    intensity: 'Advanced',
    schedule: 'Mon, Wed, Fri - 5:30 PM',
    capacity: 25,
    bookedCount: 19,
    category: 'HIIT',
    createdAt: new Date(),
  },
  {
    _id: 'w4',
    title: 'Iron Cardio Run',
    description: 'High-intensity interval runs combined with heavy kettlebell work to burn fat and increase stamina.',
    trainer: 'Sarah Jenkins',
    duration: '45 mins',
    intensity: 'Intermediate',
    schedule: 'Tue, Thu - 6:30 PM',
    capacity: 15,
    bookedCount: 6,
    category: 'Cardio',
    createdAt: new Date(),
  },
  {
    _id: 'w5',
    title: 'Warrior Mobility & Yoga',
    description: 'Improve flexibility, release tight muscle fibers, and build mental focus for heavy lifting.',
    trainer: 'Ananya Sen',
    duration: '60 mins',
    intensity: 'Beginner',
    schedule: 'Sunday - 9:00 AM',
    capacity: 30,
    bookedCount: 22,
    category: 'Yoga',
    createdAt: new Date(),
  },
];
