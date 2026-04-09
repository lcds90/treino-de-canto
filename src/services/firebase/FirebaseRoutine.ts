// src/services/firebase/FirebaseRoutineService.ts
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import type { RoutineTask } from 'src/components/models';
import type { IRoutineService } from '../interfaces/IRoutineService';
import type { ILogger } from '../interfaces/ILogger'; // <-- Importamos a interface do logger

export class FirebaseRoutineService implements IRoutineService {
  private collectionName = 'routines';

  // O Construtor agora exige um Logger genérico
  constructor(private logger: ILogger) {}

  async getAll(): Promise<RoutineTask[]> {
    // Envolvemos a lógica no logger
    return this.logger.track('GET_ALL_ROUTINES', this.collectionName, null, async () => {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RoutineTask[];
    });
  }

  async getById(id: string): Promise<RoutineTask | null> {
    return this.logger.track('GET_ROUTINE_BY_ID', `${this.collectionName}/${id}`, null, async () => {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as RoutineTask;
      }
      return null;
    });
  }

  async create(task: Omit<RoutineTask, 'id'>): Promise<RoutineTask> {
    return this.logger.track('CREATE_ROUTINE', this.collectionName, task, async () => {
      const docRef = await addDoc(collection(db, this.collectionName), task);
      return {
        id: docRef.id,
        ...task
      } as RoutineTask;
    });
  }

  async update(task: RoutineTask): Promise<void> {
    return this.logger.track('UPDATE_ROUTINE', `${this.collectionName}/${task.id}`, task, async () => {
      const docRef = doc(db, this.collectionName, task.id);
      const { id, ...dataToUpdate } = task;
      await setDoc(docRef, dataToUpdate, { merge: true });
    });
  }

  async delete(id: string): Promise<void> {
    console.log('Deleting routine with ID:', id); // Log para verificar o ID
    return this.logger.track('DELETE_ROUTINE', `${this.collectionName}/${id}`, null, async () => {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    });
  }
}
