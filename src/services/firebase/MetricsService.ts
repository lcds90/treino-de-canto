// src/services/metrics/MetricsService.ts
import type { WorkoutSession } from 'src/components/models';

const getLocalDateString = (isoString: string | Date) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export class MetricsService {
  calculateStreak(sessions: WorkoutSession[]): number {
    if (!sessions || sessions.length === 0) return 0;

    const uniqueDates = [...new Set(sessions.map((s) => getLocalDateString(s.date)))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    let streak = 0;
    const todayStr = getLocalDateString(new Date());

    const mostRecent = uniqueDates[0] as string;

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceLastWorkout = Math.floor(
      (new Date(todayStr).getTime() - new Date(mostRecent).getTime()) / msPerDay,
    );

    if (daysSinceLastWorkout > 1) return 0;

    const currentDate = new Date(mostRecent);
    for (let i = 0; i < uniqueDates.length; i++) {
      const iterDate = new Date(uniqueDates[i] as string);
      if (Math.abs(currentDate.getTime() - iterDate.getTime()) < msPerDay * 1.5) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  getWeeklyPerformance(sessions: WorkoutSession[]) {
    const last7Days = [];
    const completedData = [];
    const partialData = []; // <-- Array para parciais
    const uncompletedData = []; // <-- Array para não feitos

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dateStr = getLocalDateString(d);
      last7Days.push(new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(d));

      const daySessions = sessions.filter((s) => getLocalDateString(s.date) === dateStr);

      let dayCompleted = 0;
      let dayPartial = 0;
      let dayUncompleted = 0;

      daySessions.forEach((session) => {
        // Agora dividimos exatamente nas 3 categorias
        dayCompleted += session.metrics.completed;
        dayPartial += session.metrics.partial;
        dayUncompleted += session.metrics.uncompleted;
      });

      completedData.push(dayCompleted);
      partialData.push(dayPartial);
      uncompletedData.push(dayUncompleted);
    }

    return {
      labels: last7Days,
      completed: completedData,
      partial: partialData,
      uncompleted: uncompletedData,
    };
  }

  // Adicione isso logo abaixo da função getWeeklyPerformance

  getBestPerformanceDay(sessions: WorkoutSession[]) {
    if (!sessions || sessions.length === 0) return null;

    // 1. Agrupamos os dados por dia (YYYY-MM-DD)
    const dailyStats: Record<string, { completed: number; partial: number }> = {};

    sessions.forEach((s) => {
      const dateStr = getLocalDateString(s.date);
      if (!dailyStats[dateStr]) dailyStats[dateStr] = { completed: 0, partial: 0 };

      dailyStats[dateStr].completed += s.metrics.completed;
      dailyStats[dateStr].partial += s.metrics.partial;
    });

    // 2. Procuramos o dia campeão
    let bestDate: string | null = null;
    let maxCompleted = -1;
    let maxPartial = -1;

    for (const [date, stats] of Object.entries(dailyStats)) {
      // Ignora dias em que o usuário treinou mas não marcou NENHUM checklist
      if (stats.completed === 0 && stats.partial === 0) continue;

      // Critério 1: Mais exercícios completos
      if (stats.completed > maxCompleted) {
        maxCompleted = stats.completed;
        maxPartial = stats.partial;
        bestDate = date;
      }
      // Critério 2 (Desempate): Se empatou nos completos, ganha quem tem mais parciais
      else if (stats.completed === maxCompleted) {
        if (stats.partial > maxPartial) {
          maxPartial = stats.partial;
          bestDate = date;
        }
      }
    }

    if (!bestDate) return null; // Retorna nulo se não achou nenhum dia válido

    return {
      date: bestDate,
      completed: maxCompleted,
      partial: maxPartial,
    };
  }
}

export const metricsService = new MetricsService();
