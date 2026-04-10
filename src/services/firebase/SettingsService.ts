// src/services/firebase/FirebaseSettingsService.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import type { ISettingsService } from '../interfaces/ISettingsService';
import type { ILogger } from '../interfaces/ILogger';

export class FirebaseSettingsService implements ISettingsService {
  // Referência para um documento único que guardará todas as configurações
  private docRef = doc(db, 'settings', 'global');

  constructor(private logger: ILogger) {}

  async getSettings(): Promise<any | null> {
    return this.logger.track('GET_SETTINGS', 'settings/global', null, async () => {
      const snap = await getDoc(this.docRef);
      if (snap.exists()) {
        return snap.data();
      }
      return null;
    });
  }

  async saveSettings(settings: any): Promise<void> {
    return this.logger.track('SAVE_SETTINGS', 'settings/global', settings, async () => {
      // O merge: true garante que se houver outros campos lá, eles não serão apagados
      await setDoc(this.docRef, settings, { merge: true });
    });
  }
}
