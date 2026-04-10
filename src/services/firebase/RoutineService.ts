// src/services/firebase/FirebaseRoutineService.ts
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from 'src/boot/firebase';

import type { RoutineTask, WorkoutSession } from 'src/components/models';
import type { IRoutineService } from '../interfaces/IRoutineService';
import type { ILogger } from '../interfaces/ILogger';

export class FirebaseRoutineService implements IRoutineService {
  private collections = {
    routines: 'routines',
    workoutSessions: 'workout_sessions'
  };

  constructor(private logger: ILogger) {}

  async getAll(): Promise<RoutineTask[]> {
    return this.logger.track('GET_ALL_ROUTINES', this.collections.routines, null, async () => {
      const querySnapshot = await getDocs(collection(db, this.collections.routines));
      return querySnapshot.docs.map(doc => ({
        ...doc.data(), // 1º: Despeja os dados do banco primeiro
        id: doc.id     // 2º: OBRIGA o ID real do documento a ser o vencedor
      })) as RoutineTask[];
    });
  }

  async getById(id: string): Promise<RoutineTask | null> {
    return this.logger.track('GET_ROUTINE_BY_ID', `${this.collections.routines}/${id}`, null, async () => {
      const docRef = doc(db, this.collections.routines, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id
        } as RoutineTask;
      }
      return null;
    });
  }

   async create(task: Omit<RoutineTask, 'id'>): Promise<RoutineTask> {
    return this.logger.track('CREATE_ROUTINE', this.collections.routines, task, async () => {
      const { id, ...dataToSave } = task as any;

      // Injeta as datas de criação e atualização automaticamente
      const now = new Date().toISOString();
      dataToSave.createdAt = now;
      dataToSave.updatedAt = now;

      const docRef = await addDoc(collection(db, this.collections.routines), dataToSave);
      return { ...dataToSave, id: docRef.id } as RoutineTask;
    });
  }

  async update(task: RoutineTask): Promise<void> {
    return this.logger.track('UPDATE_ROUTINE', `${this.collections.routines}/${task.id}`, task, async () => {
      const docRef = doc(db, this.collections.routines, task.id);
      const { id, ...dataToUpdate } = task;

      // Atualiza a data de modificação
      dataToUpdate.updatedAt = new Date().toISOString();

      await setDoc(docRef, dataToUpdate, { merge: true });
    });
  }

  async delete(id: string): Promise<void> {
    return this.logger.track('DELETE_ROUTINE', `${this.collections.routines}/${id}`, null, async () => {
      const docRef = doc(db, this.collections.routines, id);
      await deleteDoc(docRef);
    });
  }

  async saveWorkoutSession(workoutData: WorkoutSession): Promise<WorkoutSession> {
    return this.logger.track('SAVE_WORKOUT_SESSION', this.collections.workoutSessions, workoutData, async () => {
      const { id, ...dataToSave } = workoutData;

      const now = new Date().toISOString();
      dataToSave.date = now;

      const docRef = await addDoc(collection(db, this.collections.workoutSessions), dataToSave);
      return { ...dataToSave, id: docRef.id } as WorkoutSession;
    });
  }
}
