// src/services/interfaces/ISettingsService.ts
export interface ISettingsService {
  getSettings(): Promise<any | null>;
  saveSettings(settings: any): Promise<void>;
}
