import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        converter: resolve(__dirname, 'src/projects/converter/converter.html'),
        filter: resolve(__dirname, 'src/projects/filter/filter.html'),
        tttGame: resolve(__dirname, 'src/projects/ttt-game/ttt.html'),
        colorPicker: resolve(
          __dirname,
          'src/projects/color-picker/color-picker.html'
        ),
      },
    },
  },

  base: '/js-mini-projects/',
});
