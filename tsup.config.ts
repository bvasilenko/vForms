// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  treeshake: true,
  splitting: false,
  external: [
    'react',
    'react-dom',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    '@booga/vui',
  ],
})
