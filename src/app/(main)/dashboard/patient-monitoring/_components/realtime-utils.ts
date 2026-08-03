export const MONITORING_SPEED = 0.75;

export function createRealtimeTicker(intervalMs: number) {
  let interval: number | undefined;
  let tick = 0;
  const listeners = new Set<() => void>();

  return {
    getSnapshot: () => tick,
    subscribe(listener: () => void) {
      listeners.add(listener);

      if (interval === undefined) {
        interval = window.setInterval(() => {
          tick += 1;
          listeners.forEach((notify) => {
            notify();
          });
        }, intervalMs);
      }

      return () => {
        listeners.delete(listener);

        if (listeners.size === 0 && interval !== undefined) {
          window.clearInterval(interval);
          interval = undefined;
        }
      };
    },
  };
}
