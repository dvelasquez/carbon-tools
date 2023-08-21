import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

export default function config({ input = 'src/index.ts', name }) {
  return {
    input,
    output: [
      {
        file: 'dist/esm/index.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/umd/index.js',
        format: 'umd',
        sourcemap: true,
        name,
      },
    ],
    plugins: [typescript(), commonjs()],
  };
}
