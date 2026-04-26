// Redis / BullMQ is currently disabled as a placeholder.
// TODO: Re-enable the real queue after fixing Redis connectivity.

export const taskQueue = {
  add: async (name: string, data: any) => {
    console.warn('Task queue stub called:', { name, data });
    return { id: `stub-${Date.now()}` };
  }
};
