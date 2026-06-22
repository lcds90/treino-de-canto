import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import type { RoutineTask } from 'src/components/models';
import type { ITemplateService } from '../interfaces/ITemplateService';
import type { ILogger } from '../interfaces/ILogger';

export class FirebaseTemplateService implements ITemplateService {
  constructor(private logger: ILogger) {}

  private getTemplatesCollection() {
    return collection(db, 'templates');
  }

  private getTemplateDoc(id: string) {
    return doc(db, 'templates', id);
  }

  async getAll(): Promise<RoutineTask[]> {
    return this.logger.track('GET_ALL_TEMPLATES', 'templates', null, async () => {
      const querySnapshot = await getDocs(this.getTemplatesCollection());
      const results = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as RoutineTask[];
      
      // Ordena por ordem manual
      results.sort((a, b) => (a.order || 0) - (b.order || 0));
      return results;
    });
  }

  async getById(id: string): Promise<RoutineTask | null> {
    return this.logger.track('GET_TEMPLATE_BY_ID', `templates/${id}`, null, async () => {
      const docRef = this.getTemplateDoc(id);
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

  async create(template: Omit<RoutineTask, 'id'>): Promise<RoutineTask> {
    return this.logger.track('CREATE_TEMPLATE', 'templates', template, async () => {
      const dataToSave = { ...template } as any;
      delete dataToSave.id;

      const now = new Date().toISOString();
      dataToSave.createdAt = now;
      dataToSave.updatedAt = now;

      const docRef = await addDoc(this.getTemplatesCollection(), dataToSave);
      return { ...dataToSave, id: docRef.id } as RoutineTask;
    });
  }

  async update(template: RoutineTask): Promise<void> {
    return this.logger.track('UPDATE_TEMPLATE', `templates/${template.id}`, template, async () => {
      const docRef = this.getTemplateDoc(template.id);
      const dataToUpdate = { ...template } as any;
      delete dataToUpdate.id;

      dataToUpdate.updatedAt = new Date().toISOString();

      await setDoc(docRef, dataToUpdate, { merge: true });
    });
  }

  async delete(id: string): Promise<void> {
    return this.logger.track('DELETE_TEMPLATE', `templates/${id}`, null, async () => {
      const docRef = this.getTemplateDoc(id);
      await deleteDoc(docRef);
    });
  }
}
