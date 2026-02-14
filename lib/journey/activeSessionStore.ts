import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveSessionState {
    activityId: string | null;
    startTime: number | null; // Timestamp
    isPaused: boolean;
    elapsedSeconds: number;

    // Actions
    startSession: (activityId: string) => void;
    pauseSession: () => void;
    resumeSession: () => void;
    endSession: () => void;
    tick: () => void; // Call every second if running
}

export const useActiveSession = create<ActiveSessionState>()(
    persist(
        (set, get) => ({
            activityId: null,
            startTime: null,
            isPaused: true,
            elapsedSeconds: 0,

            startSession: (activityId) => {
                // Se já estiver rodando a mesma atividade, não reseta
                if (get().activityId === activityId && !get().isPaused) return;

                set({
                    activityId,
                    startTime: Date.now(),
                    isPaused: false,
                    elapsedSeconds: get().activityId === activityId ? get().elapsedSeconds : 0,
                });
            },

            pauseSession: () => set({ isPaused: true }),

            resumeSession: () => set({ isPaused: false }),

            endSession: () => set({
                activityId: null,
                startTime: null,
                isPaused: true,
                elapsedSeconds: 0
            }),

            tick: () => {
                if (!get().isPaused && get().activityId) {
                    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
                }
            },
        }),
        {
            name: "active-session-storage",
        }
    )
);
