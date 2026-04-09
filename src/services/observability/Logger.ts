// src/services/observability/ConsoleLogger.ts
import type { ILogger } from '../interfaces/ILogger';

export class ConsoleLogger implements ILogger {

  async track<T>(operationName: string, pathOrUrl: string, payload: any, task: () => Promise<T>): Promise<T> {
    // 1. Marca o início
    const startTime = performance.now();
    const startDate = new Date();

    try {
      // 2. Executa a tarefa (A ida ao Firebase)
      const result = await task();

      // 3. Marca o fim e calcula a duração
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      const endDate = new Date();

      // 4. Log de Sucesso com CSS e Emojis
      console.groupCollapsed(
        `%c Logger %c 🟢 [SUCESSO] ${operationName} | ⏱️ ${duration}ms`,
        'background: #333; color: #00FF00; font-weight: bold; padding: 2px 6px; border-radius: 4px;', // Estilo do "Logger"
        'color: inherit; font-weight: normal;' // Reset do estilo
      );
      console.log(`🕒 Início: ${startDate.toISOString()}`);
      console.log(`🏁 Fim: ${endDate.toISOString()}`);
      console.log(`🌐 Caminho/URL: /${pathOrUrl}`);
      if (payload) console.log(`📦 Payload:`, payload);
      console.log(`✅ Resultado:`, result);
      console.groupEnd();

      return result;

    } catch (error) {
      // Log de Erro
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      const endDate = new Date();

      console.groupCollapsed(
        `%c Logger %c 🔴 [ERRO] ${operationName} | ⏱️ ${duration}ms`,
        'background: #333; color: #FF0000; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
        'color: #FF5555; font-weight: bold;'
      );
      console.log(`🕒 Início: ${startDate.toISOString()}`);
      console.log(`🏁 Fim: ${endDate.toISOString()}`);
      console.log(`🌐 Caminho/URL: /${pathOrUrl}`);
      if (payload) console.log(`📦 Payload:`, payload);
      console.error(`💥 Detalhes do Erro:`, error);
      console.groupEnd();

      throw error; // Repassa o erro para a UI tratar
    }
  }
}
