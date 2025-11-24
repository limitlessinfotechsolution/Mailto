import { logger } from '@mailo/shared';

const hooks = {
  onLogin: [],
  onMessageReceived: [],
  onMessageSent: []
};

export const registerHook = (event, callback) => {
  if (hooks[event]) {
    hooks[event].push(callback);
  } else {
    logger.warn(`Unknown hook event: ${event}`);
  }
};

export const triggerHook = async (event, data) => {
  if (hooks[event]) {
    for (const callback of hooks[event]) {
      try {
        await callback(data);
      } catch (err) {
        logger.error(`Error in hook ${event}`, err);
      }
    }
  }
};

// Example Plugin Loader
export const loadPlugins = () => {
  // In a real app, this would dynamically load modules from a 'plugins' directory
  logger.info('Plugins loaded');
  
  // Example internal plugin: Audit Log Login
  registerHook('onLogin', async (user) => {
    logger.info(`[AUDIT] User ${user.email} logged in at ${new Date().toISOString()}`);
  });
};
