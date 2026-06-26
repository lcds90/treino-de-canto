// src/services/firebase/FirebaseRoutineService.ts
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from 'src/boot/firebase';

import type { RoutineTask, WorkoutSession } from 'src/components/models';
import type { IRoutineService } from '../interfaces/IRoutineService';
import type { ILogger } from '../interfaces/ILogger';

export class FirebaseRoutineService implements IRoutineService {
  constructor(private logger: ILogger) {}

  private getRoutinesCollection() {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    return collection(db, 'users', user.uid, 'routines');
  }

  private getRoutineDoc(id: string) {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    return doc(db, 'users', user.uid, 'routines', id);
  }

  private getWorkoutSessionsCollection() {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    return collection(db, 'users', user.uid, 'workout_sessions');
  }

  async getAll(): Promise<RoutineTask[]> {
    return this.logger.track('GET_ALL_ROUTINES', 'routines', null, async () => {
      const querySnapshot = await getDocs(this.getRoutinesCollection());
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(), // 1º: Despeja os dados do banco primeiro
        id: doc.id, // 2º: OBRIGA o ID real do documento a ser o vencedor
      })) as RoutineTask[];
    });
  }

  async getById(id: string): Promise<RoutineTask | null> {
    return this.logger.track('GET_ROUTINE_BY_ID', `routines/${id}`, null, async () => {
      const docRef = this.getRoutineDoc(id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        } as RoutineTask;
      }
      return null;
    });
  }

  async create(task: Omit<RoutineTask, 'id'>): Promise<RoutineTask> {
    return this.logger.track('CREATE_ROUTINE', 'routines', task, async () => {
      const dataToSave = { ...task } as any;
      delete dataToSave.id;

      // Injeta as datas de criação e atualização automaticamente
      const now = new Date().toISOString();
      dataToSave.createdAt = now;
      dataToSave.updatedAt = now;

      const docRef = await addDoc(this.getRoutinesCollection(), dataToSave);
      return { ...dataToSave, id: docRef.id } as RoutineTask;
    });
  }

  async update(task: RoutineTask): Promise<void> {
    return this.logger.track('UPDATE_ROUTINE', `routines/${task.id}`, task, async () => {
      const docRef = this.getRoutineDoc(task.id);
      const dataToUpdate = { ...task } as any;
      delete dataToUpdate.id;

      // Atualiza a data de modificação
      dataToUpdate.updatedAt = new Date().toISOString();

      await setDoc(docRef, dataToUpdate, { merge: true });
    });
  }

  async delete(id: string): Promise<void> {
    return this.logger.track('DELETE_ROUTINE', `routines/${id}`, null, async () => {
      const docRef = this.getRoutineDoc(id);
      await deleteDoc(docRef);
    });
  }

  async saveWorkoutSession(workoutData: WorkoutSession): Promise<WorkoutSession> {
    return this.logger.track('SAVE_WORKOUT_SESSION', 'workout_sessions', workoutData, async () => {
      const dataToSave = { ...workoutData } as any;
      delete dataToSave.id;

      const now = new Date().toISOString();
      dataToSave.date = now;

      const docRef = await addDoc(this.getWorkoutSessionsCollection(), dataToSave);
      return { ...dataToSave, id: docRef.id } as WorkoutSession;
    });
  }
}
