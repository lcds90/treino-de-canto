import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import type { WorkoutSession } from 'src/components/models';
import type { IWorkoutService } from '../interfaces/IWorkoutService';
import type { ILogger } from '../interfaces/ILogger';

export class FirebaseWorkoutService implements IWorkoutService {
  private collectionName = 'workout_sessions';

  constructor(private logger: ILogger) {}

  async getAll(): Promise<WorkoutSession[]> {
    return this.logger.track('GET_ALL_WORKOUTS', this.collectionName, null, async () => {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as WorkoutSession[];
    });
  }

  async getById(id: string): Promise<WorkoutSession | null> {
    return this.logger.track('GET_WORKOUT_BY_ID', `${this.collectionName}/${id}`, null, async () => {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as WorkoutSession;
      }
      return null;
    });
  }

  async create(workoutData: WorkoutSession): Promise<WorkoutSession> {
    return this.logger.track('CREATE_WORKOUT', this.collectionName, workoutData, async () => {
      const { id, ...dataToSave } = workoutData as any;

      // Garante a data exata da conclusão do treino
      dataToSave.date = new Date().toISOString();

      const docRef = await addDoc(collection(db, this.collectionName), dataToSave);
      return { ...dataToSave, id: docRef.id } as WorkoutSession;
    });
  }
}
