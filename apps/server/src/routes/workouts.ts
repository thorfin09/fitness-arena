import { Router, Response } from 'express';
import Workout from '../models/Workout';
import { authenticate, AuthRequest } from '../middleware/auth';
import { MOCK_WORKOUTS } from '../mockDb';

const router = Router();

// Pre-seeded workout data for MongoDB
const DEFAULT_WORKOUTS = [
  {
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

// Helper to seed workouts if empty
export const seedWorkouts = async () => {
  try {
    const count = await Workout.countDocuments();
    if (count === 0) {
      await Workout.insertMany(DEFAULT_WORKOUTS);
      console.log('Successfully seeded default gym workouts!');
    }
  } catch (error) {
    console.error('Failed to seed default workouts:', error);
  }
};

// @route   GET api/workouts
// @desc    Get all gym workouts (seeds if empty)
router.get('/', async (req: AuthRequest, res: Response) => {
  if (process.env.MOCK_DB === 'true') {
    return res.json(MOCK_WORKOUTS);
  }

  try {
    await seedWorkouts();
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching workouts', error: (error as Error).message });
  }
});

// @route   POST api/workouts/:id/book
// @desc    Book a spot in a workout class
router.post('/:id/book', authenticate, async (req: AuthRequest, res: Response) => {
  if (process.env.MOCK_DB === 'true') {
    const workout = MOCK_WORKOUTS.find((w) => w._id === req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout class not found (Demo Mode)' });
    }

    if (workout.bookedCount >= workout.capacity) {
      return res.status(400).json({ message: 'This workout class is fully booked (Demo Mode)' });
    }

    workout.bookedCount += 1;
    return res.json({
      message: 'Workout class booked successfully! (Demo Mode)',
      workout,
    });
  }

  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout class not found' });
    }

    if (workout.bookedCount >= workout.capacity) {
      return res.status(400).json({ message: 'This workout class is fully booked' });
    }

    workout.bookedCount += 1;
    await workout.save();

    res.json({
      message: 'Workout class booked successfully!',
      workout,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error booking workout', error: (error as Error).message });
  }
});

// @route   POST api/workouts
// @desc    Create a new workout (Admin/Trainer only)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.userRole !== 'admin' && req.userRole !== 'trainer') {
    return res.status(403).json({ message: 'Unauthorized. Trainers or Admins only.' });
  }

  const { title, description, trainer, duration, intensity, schedule, capacity, category } = req.body;

  if (!title || !description || !trainer || !duration || !schedule) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  if (process.env.MOCK_DB === 'true') {
    const newWorkout = {
      _id: 'mock_workout_' + Date.now(),
      title,
      description,
      trainer,
      duration,
      intensity: (intensity || 'Intermediate') as any,
      schedule,
      capacity: Number(capacity) || 20,
      bookedCount: 0,
      category: category || 'Strength',
      createdAt: new Date(),
    };
    MOCK_WORKOUTS.push(newWorkout);
    return res.status(201).json(newWorkout);
  }

  try {
    const newWorkout = new Workout({
      title,
      description,
      trainer,
      duration,
      intensity,
      schedule,
      capacity,
      category,
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating workout', error: (error as Error).message });
  }
});

export default router;
