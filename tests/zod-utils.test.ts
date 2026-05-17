// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { extractEnumOptions, resolveFieldKind, unwrapZodType } from '../src'

describe('unwrapZodType', () => {
  it('returns a terminal type unchanged (identity)', () => {
    const s = z.string()
    expect(unwrapZodType(s)).toBe(s)
  })

  it.each([
    ['ZodOptional', z.string().optional()],
    ['ZodNullable', z.string().nullable()],
    ['ZodDefault', z.string().default('x')],
    ['ZodCatch', z.string().catch('')],
    ['ZodReadonly', z.string().readonly()],
    ['ZodBranded', z.string().brand()],
    ['ZodEffects/refine', z.string().refine(v => v.length >= 0)],
    ['ZodEffects/transform', z.string().transform(v => v.trim())],
    ['ZodPipeline', z.string().pipe(z.string())],
  ] as const)('unwraps %s to ZodString', (_, schema) => {
    expect(unwrapZodType(schema)._def.typeName).toBe('ZodString')
  })

  it('unwraps ZodLazy to its inner type', () => {
    expect(unwrapZodType(z.lazy(() => z.string()))._def.typeName).toBe('ZodString')
  })

  it('unwraps a chain of wrappers to the innermost concrete type', () => {
    expect(
      unwrapZodType(z.string().default('x').optional().nullable())._def.typeName,
    ).toBe('ZodString')
  })

  it('halts at MAX_DEPTH without throwing and returns a defined schema', () => {
    let deep = z.string() as z.ZodTypeAny
    for (let i = 0; i < 11; i++) deep = deep.optional()
    expect(unwrapZodType(deep)).toBeDefined()
  })

  it('unwraps number, boolean, date types correctly', () => {
    expect(unwrapZodType(z.number().optional())._def.typeName).toBe('ZodNumber')
    expect(unwrapZodType(z.boolean().nullable())._def.typeName).toBe('ZodBoolean')
    expect(unwrapZodType(z.date().default(new Date(0)))._def.typeName).toBe('ZodDate')
  })
})

describe('resolveFieldKind', () => {
  it.each([
    ['ZodString', z.string(), 'string'],
    ['ZodNumber', z.number(), 'number'],
    ['ZodBoolean', z.boolean(), 'boolean'],
    ['ZodEnum', z.enum(['a', 'b']), 'enum'],
    ['ZodDate', z.date(), 'date'],
  ] as const)('%s → "%s"', (_, schema, expected) => {
    expect(resolveFieldKind(schema)).toBe(expected)
  })

  it('ZodNativeEnum → "enum"', () => {
    enum Dir { Up = 'up', Down = 'down' }
    expect(resolveFieldKind(z.nativeEnum(Dir))).toBe('enum')
  })

  it('unrecognised type → "unknown"', () => {
    expect(resolveFieldKind(z.undefined())).toBe('unknown')
  })

  it.each([
    ['ZodOptional', z.boolean().optional(), 'boolean'],
    ['ZodNullable', z.number().nullable(), 'number'],
    ['ZodDefault', z.string().default('x'), 'string'],
    ['ZodEffects', z.string().refine(v => !!v), 'string'],
  ] as const)('resolves through %s wrapper', (_, schema, expected) => {
    expect(resolveFieldKind(schema)).toBe(expected)
  })
})

describe('extractEnumOptions', () => {
  it('returns empty array for a non-enum type', () => {
    expect(extractEnumOptions(z.string())).toEqual([])
  })

  it('returns empty array for a non-enum wrapped in ZodOptional', () => {
    expect(extractEnumOptions(z.string().optional())).toEqual([])
  })

  it('maps ZodEnum values to symmetric label/value pairs', () => {
    expect(extractEnumOptions(z.enum(['a', 'b', 'c']))).toEqual([
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b' },
      { label: 'c', value: 'c' },
    ])
  })

  it('maps ZodNativeEnum string-value members using key as label, value as value', () => {
    enum Color { Red = 'red', Green = 'green' }
    expect(extractEnumOptions(z.nativeEnum(Color))).toEqual([
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
    ])
  })

  it('filters numeric reverse-mapping keys from a numeric ZodNativeEnum', () => {
    enum Direction { Up = 0, Down = 1 }
    const result = extractEnumOptions(z.nativeEnum(Direction))
    expect(result).toEqual([
      { label: 'Up', value: '0' },
      { label: 'Down', value: '1' },
    ])
    expect(result.every(o => isNaN(Number(o.label)))).toBe(true)
  })

  it('unwraps ZodOptional around ZodEnum and still returns options', () => {
    expect(extractEnumOptions(z.enum(['x', 'y']).optional())).toEqual([
      { label: 'x', value: 'x' },
      { label: 'y', value: 'y' },
    ])
  })

  it('unwraps ZodDefault around ZodEnum and still returns options', () => {
    expect(extractEnumOptions(z.enum(['a', 'b']).default('a'))).toEqual([
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b' },
    ])
  })
})
