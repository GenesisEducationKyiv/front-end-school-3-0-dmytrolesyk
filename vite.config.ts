import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@music-manager-api/tracks-queries': path.resolve(
        __dirname,
        'node_modules/@buf/dmytrolesyk_music-manager-api.connectrpc_query-es/tracks/v1/tracks-TracksService_connectquery',
      ),
      '@music-manager-api/tracks-service': path.resolve(
        __dirname,
        'node_modules/@buf/dmytrolesyk_music-manager-api.bufbuild_es/tracks/v1/tracks_pb',
      ),
    },
  },
  server: {
    port: 3000,
  },
});
