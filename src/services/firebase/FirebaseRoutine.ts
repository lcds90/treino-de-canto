// src/services/firebase/FirebaseRoutineService.ts
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import type { RoutineTask } from 'src/components/models';
import type { IRoutineService } from '../interfaces/IRoutineService';
import type { ILogger } from '../interfaces/ILogger';

export class FirebaseRoutineService implements IRoutineService {
  private collectionName = 'routines';

  constructor(private logger: ILogger) {}

  async getAll(): Promise<RoutineTask[]> {
    return this.logger.track('GET_ALL_ROUTINES', this.collectionName, null, async () => {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => ({
        ...doc.data(), // 1º: Despeja os dados do banco primeiro
        id: doc.id     // 2º: OBRIGA o ID real do documento a ser o vencedor
      })) as RoutineTask[];
    });
  }

  async getById(id: string): Promise<RoutineTask | null> {
    return this.logger.track('GET_ROUTINE_BY_ID', `${this.collectionName}/${id}`, null, async () => {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          ...docSnap.data(), // 1º: Despeja os dados
          id: docSnap.id     // 2º: Garante o ID real
        } as RoutineTask;
      }
      return null;
    });
  }

  async create(task: Omit<RoutineTask, 'id'>): Promise<RoutineTask> {
    return this.logger.track('CREATE_ROUTINE', this.collectionName, task, async () => {
      // BLINDAGEM: Se por acaso vier um 'id' no payload, nós o arrancamos fora aqui
      // para garantir que ele nunca seja salvo DENTRO do documento
      const { id, ...dataToSave } = task as any;

      const docRef = await addDoc(collection(db, this.collectionName), dataToSave);
      return {
        ...dataToSave,
        id: docRef.id
      } as RoutineTask;
    });
  }

  async update(task: RoutineTask): Promise<void> {
    return this.logger.track('UPDATE_ROUTINE', `${this.collectionName}/${task.id}`, task, async () => {
      const docRef = doc(db, this.collectionName, task.id);

      // O update já estava blindado tirando o ID, o que é ótimo!
      const { id, ...dataToUpdate } = task;

      await setDoc(docRef, dataToUpdate, { merge: true });
    });
  }

  async delete(id: string): Promise<void> {
    return this.logger.track('DELETE_ROUTINE', `${this.collectionName}/${id}`, null, async () => {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    });
  }
}
