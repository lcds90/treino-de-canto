// src/services/index.ts
import type { IRoutineService } from './interfaces/IRoutineService';
import type { IWorkoutService } from './interfaces/IWorkoutService';
import type { ILogger } from './interfaces/ILogger';

import { ConsoleLogger } from './observability/Logger';
import { FirebaseRoutineService } from './firebase/RoutineService';
import { FirebaseWorkoutService } from './firebase/WorkoutService';

export const appLogger: ILogger = new ConsoleLogger();

export const routineService: IRoutineService = new FirebaseRoutineService(appLogger);
export const workoutService: IWorkoutService = new FirebaseWorkoutService(appLogger);
