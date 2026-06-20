import { collection, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from 'src/boot/firebase';
import type { WorkoutSession } from 'src/components/models';
import type { IWorkoutService } from '../interfaces/IWorkoutService';
import type { ILogger } from '../interfaces/ILogger';

export class FirebaseWorkoutService implements IWorkoutService {
  constructor(private logger: ILogger) {}

  private getWorkoutsCollection() {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    return collection(db, 'users', user.uid, 'workout_sessions');
  }

  private getWorkoutDoc(id: string) {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    return doc(db, 'users', user.uid, 'workout_sessions', id);
  }

  async getAll(): Promise<WorkoutSession[]> {
    return this.logger.track('GET_ALL_WORKOUTS', 'workout_sessions', null, async () => {
      const querySnapshot = await getDocs(this.getWorkoutsCollection());
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as WorkoutSession[];
    });
  }

  async getById(id: string): Promise<WorkoutSession | null> {
    return this.logger.track('GET_WORKOUT_BY_ID', `workout_sessions/${id}`, null, async () => {
      const docRef = this.getWorkoutDoc(id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as WorkoutSession;
      }
      return null;
    });
  }

  async create(workoutData: WorkoutSession): Promise<WorkoutSession> {
    return this.logger.track('CREATE_WORKOUT', 'workout_sessions', workoutData, async () => {
      const dataToSave = { ...workoutData } as any;
      delete dataToSave.id;

      // Garante a data exata da conclusão do treino
      dataToSave.date = new Date().toISOString();

      const docRef = await addDoc(this.getWorkoutsCollection(), dataToSave);
      return { ...dataToSave, id: docRef.id } as WorkoutSession;
    });
  }

  async delete(id: string): Promise<void> {
    return this.logger.track('DELETE_WORKOUT', `workout_sessions/${id}`, null, async () => {
      const docRef = this.getWorkoutDoc(id);
      await deleteDoc(docRef);
    });
  }
}
