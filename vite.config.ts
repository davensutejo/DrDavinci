import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.API_KEY_BACKUP': JSON.stringify(env.GEMINI_API_KEY_BACKUP),
        'process.env.API_KEY_BACKUP_2': JSON.stringify(env.GEMINI_API_KEY_BACKUP_2),
        'process.env.API_KEY_BACKUP_3': JSON.stringify(env.GEMINI_API_KEY_BACKUP_3),
        'process.env.API_KEY_BACKUP_4': JSON.stringify(env.GEMINI_API_KEY_BACKUP_4),
        'process.env.API_KEY_BACKUP_5': JSON.stringify(env.GEMINI_API_KEY_BACKUP_5),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:5000/api')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
