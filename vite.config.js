import { defineConfig } from 'vite';
import baseViteConfig from './server/standalone/vite.config.js';

export * from './server/providers/local.js';

export default defineConfig(async (env) => {
  const baseConfig =
    typeof baseViteConfig === 'function'
      ? await baseViteConfig(env)
      : baseViteConfig;

  const port = Number(process.env.SERVER_PORT || process.env.PORT || 4173);
  const allowAllHosts = process.env.GEV_ALLOW_ALL_HOSTS === 'true';
  const envAllowedHosts = (process.env.GEV_ALLOWED_HOSTS || '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);

  const mergedAllowedHosts = Array.from(
    new Set([
      ...(Array.isArray(baseConfig.server?.allowedHosts)
        ? baseConfig.server.allowedHosts
        : []),
      ...envAllowedHosts,
    ]),
  );

  const allowedHosts = allowAllHosts
    ? true
    : mergedAllowedHosts.length > 0
      ? mergedAllowedHosts
      : baseConfig.server?.allowedHosts;

  return {
    ...baseConfig,
    server: {
      ...baseConfig.server,
      host: '0.0.0.0',
      port,
      strictPort: true,
      allowedHosts,
    },
    preview: {
      ...baseConfig.preview,
      host: '0.0.0.0',
      port,
      strictPort: true,
      allowedHosts,
    },
  };
});
