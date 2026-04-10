// src/services/index.ts
import type { IRoutineService } from './interfaces/IRoutineService';
import type { IWorkoutService } from './interfaces/IWorkoutService';
import type { ILogger } from './interfaces/ILogger';
import type { ISettingsService } from './interfaces/ISettingsService';

import { ConsoleLogger } from './observability/Logger';
import { FirebaseRoutineService } from './firebase/RoutineService';
import { FirebaseWorkoutService } from './firebase/WorkoutService';
import { FirebaseSettingsService } from './firebase/SettingsService';

export const appLogger: ILogger = new ConsoleLogger();

export const routineService: IRoutineService = new FirebaseRoutineService(appLogger);
export const workoutService: IWorkoutService = new FirebaseWorkoutService(appLogger);
export const settingsService: ISettingsService = new FirebaseSettingsService(appLogger);
