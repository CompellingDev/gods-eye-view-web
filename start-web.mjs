import { spawn } from 'node:child_process';

// Hard-lock key-setup UI so public visitors cannot view or modify server API keys
process.env.GEV_KEY_SETUP_TRUSTED_PEERS = 'none';

const port = process.env.SERVER_PORT || process.env.PORT || '4173';
const host = '0.0.0.0';
const nodeOptions = process.env.NODE_OPTIONS || '--max-old-space-size=400';
const allowedHosts =
  process.env.GEV_ALLOW_ALL_HOSTS === 'true'
    ? 'ALL (GEV_ALLOW_ALL_HOSTS=true)'
    : process.env.GEV_ALLOWED_HOSTS || 'localhost, 127.0.0.1 (or .env config)';

console.log(`[GEV Web] Starting God's Eye View on ${host}:${port}`);
console.log(`[GEV Web] Allowed hosts: ${allowedHosts}`);
console.log(`[GEV Web] NODE_OPTIONS: ${nodeOptions}`);

const child = spawn('npx', ['vite', '--host', host, '--port', String(port)], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: String(port),
    HOST: host,
    GEV_KEY_SETUP_TRUSTED_PEERS: 'none',
    NODE_OPTIONS: nodeOptions,
  },
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
