import type { IRoutineService } from './interfaces/IRoutineService';
import type { ILogger } from './interfaces/ILogger';

import { ConsoleLogger } from './observability/Logger';
import { FirebaseRoutineService } from './firebase/FirebaseRoutine';

// 1. Criamos a ferramenta de Logger
export const appLogger: ILogger = new ConsoleLogger();

// 2. Injetamos o Logger no serviço do banco de dados
export const routineService: IRoutineService = new FirebaseRoutineService(appLogger);
