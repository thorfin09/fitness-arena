// API client service with dual-mode server connection & localStorage mockup fallback

const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Internal Local Storage keys for Frontend Mock Fallback
const LS_MOCK_USERS = 'fa_mock_db_users';
const LS_MOCK_WORKOUTS = 'fa_mock_db_workouts';

// Seed default classes locally if frontend fallback is triggered
const SEED_CLASSES = [
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
  },
];

const getLocalDb = () => {
  const users = JSON.parse(localStorage.getItem(LS_MOCK_USERS) || '[]');
  let workouts = JSON.parse(localStorage.getItem(LS_MOCK_WORKOUTS) || '[]');
  if (workouts.length === 0) {
    workouts = [...SEED_CLASSES];
    localStorage.setItem(LS_MOCK_WORKOUTS, JSON.stringify(workouts));
  }
  return { users, workouts };
};

export const apiService = {
  async signup(name: string, email: string, password: string) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Signup failed');
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend server connection failed. Falling back to local mockup database.', err);
      // Local storage fallback mock
      const { users } = getLocalDb();
      if (users.some((u: any) => u.email === email.toLowerCase())) {
        throw new Error('User already exists (Local Mode)');
      }
      const newUser = {
        id: 'local_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password, // stored in cleartext for mock client, fine for local demo
        role: 'member',
        membership: { plan: 'None', status: 'inactive' },
      };
      users.push(newUser);
      localStorage.setItem(LS_MOCK_USERS, JSON.stringify(users));
      
      return {
        token: 'mock_jwt_token_local_' + newUser.id,
        user: newUser,
        fallbackMode: true,
      };
    }
  },

  async login(email: string, password: string) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend server connection failed. Falling back to local mockup database.', err);
      const { users } = getLocalDb();
      const user = users.find((u: any) => u.email === email.toLowerCase());
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials (Local Mode)');
      }
      return {
        token: 'mock_jwt_token_local_' + user.id,
        user,
        fallbackMode: true,
      };
    }
  },

  async updateMembership(plan: string, token: string | null) {
    try {
      const res = await fetch('/api/auth/membership', {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update membership');
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend server connection failed. Falling back to local mockup database.', err);
      if (!token) throw new Error('Authorization required');
      const userId = token.replace('mock_jwt_token_local_', '');
      const { users } = getLocalDb();
      const user = users.find((u: any) => u.id === userId);
      if (!user) throw new Error('User not found in local database');
      
      const durationDays = plan === 'Beast Starter' ? 30 : plan === 'Power Lifter' ? 90 : plan === 'Olympian Pro' ? 365 : 0;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + durationDays);

      user.membership = {
        plan,
        status: plan === 'None' ? 'inactive' : 'active',
        startDate: plan === 'None' ? undefined : startDate.toISOString(),
        endDate: plan === 'None' ? undefined : endDate.toISOString(),
      };
      
      localStorage.setItem(LS_MOCK_USERS, JSON.stringify(users));
      return {
        message: 'Membership updated successfully (Local Mode)',
        membership: user.membership,
      };
    }
  },

  async getWorkouts() {
    try {
      const res = await fetch('/api/workouts');
      if (!res.ok) throw new Error('Failed to fetch workouts');
      return await res.json();
    } catch (err) {
      console.warn('Backend server connection failed. Falling back to local mockup database.', err);
      const { workouts } = getLocalDb();
      return workouts;
    }
  },

  async bookWorkout(id: string, token: string | null) {
    try {
      const res = await fetch(`/api/workouts/${id}/book`, {
        method: 'POST',
        headers: getHeaders(token),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to book workout class');
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend server connection failed. Falling back to local mockup database.', err);
      if (!token) throw new Error('Authentication required to book classes.');
      const { workouts } = getLocalDb();
      const workout = workouts.find((w: any) => w._id === id);
      if (!workout) throw new Error('Workout class not found (Local Mode)');
      
      if (workout.bookedCount >= workout.capacity) {
        throw new Error('This workout class is fully booked.');
      }
      
      workout.bookedCount += 1;
      localStorage.setItem(LS_MOCK_WORKOUTS, JSON.stringify(workouts));
      return {
        message: 'Workout class booked successfully! (Local Mode)',
        workout,
      };
    }
  },
};
export default apiService;
