import client from 'prom-client';

const globalMetrics = global as any;

if (!globalMetrics._promRegistry) {
  const register = new client.Registry();

  const serverActionCounter = new client.Counter({
    name: 'server_actions_total',
    help: 'Number of times server actions were called',
    labelNames: ['action'],
  });

  const serverActionErrorCounter = new client.Counter({
    name: 'server_action_errors_total',
    help: 'Number of failed server actions',
    labelNames: ['action'],
  });

  // --- Histogram: duration of each action ---
  const serverActionDuration = new client.Histogram({
    name: 'server_action_duration_seconds',
    help: 'Time taken for each server action to complete',
    labelNames: ['action'],
    buckets: [0.1, 0.5, 1, 2, 5], // seconds
  });

  // --- Gauge: active actions ---
  const activeServerActions = new client.Gauge({
    name: 'active_server_actions',
    help: 'Number of currently running server actions',
    labelNames: ['action'],
  });

  register.registerMetric(serverActionCounter);
  register.registerMetric(serverActionErrorCounter);
  register.registerMetric(serverActionDuration);
  register.registerMetric(activeServerActions);

    globalMetrics._promRegistry = {
    register,
    serverActionCounter,
    serverActionErrorCounter,
    serverActionDuration,
    activeServerActions,
  };
}

export const {
  register,
  serverActionCounter,
  serverActionErrorCounter,
  serverActionDuration,
  activeServerActions,
} = globalMetrics._promRegistry as {
  register: client.Registry;
  serverActionCounter: client.Counter<string>;
  serverActionErrorCounter: client.Counter<string>;
  serverActionDuration: client.Histogram<string>;
  activeServerActions: client.Gauge<string>;
};
