import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';

const extensions = ['.ts', '.js'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preventTreeShakingPlugin = () => {
  return {
    name: 'no-treeshaking',
    resolveId(id, importer) {
      if (!importer) {
        // let's not theeshake entry points, as we're not exporting anything in Apps Script files
        return { id, moduleSideEffects: 'no-treeshake' };
      }
      return null;
    },
  };
};

export default {
  input: './src/main.ts',
  output: {
    dir: 'build',
    format: 'esm',
  },
  plugins: [
    preventTreeShakingPlugin(),
    nodeResolve({ extensions }),
    babel({ extensions, babelHelpers: "runtime", skipPreflightCheck: true }),
    alias({
      entries: {
        '@': path.resolve(__dirname, 'src'),
      }
    }),
  ],
};
