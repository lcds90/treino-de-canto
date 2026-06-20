// src/services/firebase/FirebaseSettingsService.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from 'src/boot/firebase';
import type { ISettingsService } from '../interfaces/ISettingsService';
import type { ILogger } from '../interfaces/ILogger';

export class FirebaseSettingsService implements ISettingsService {
  constructor(private logger: ILogger) {}

  private getSettingsDoc() {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    return doc(db, 'users', user.uid);
  }

  async getSettings(): Promise<any | null> {
    return this.logger.track('GET_SETTINGS', 'users/settings', null, async () => {
      const snap = await getDoc(this.getSettingsDoc());
      if (snap.exists()) {
        return snap.data();
      }
      return null;
    });
  }

  async saveSettings(settings: any): Promise<void> {
    return this.logger.track('SAVE_SETTINGS', 'users/settings', settings, async () => {
      // O merge: true garante que se houver outros campos lá, eles não serão apagados
      await setDoc(this.getSettingsDoc(), settings, { merge: true });
    });
  }
}
