// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import type { ZodTypeAny } from 'zod'
import { unwrapZodType } from './unwrapZodType'

export interface OptionItem {
  label: string
  value: string
}

export function extractEnumOptions(schema: ZodTypeAny): OptionItem[] {
  const inner = unwrapZodType(schema)
  const def = inner._def as Record<string, unknown>
  const typeName = def.typeName as string

  if (typeName === 'ZodEnum') {
    return (def.values as string[]).map(v => ({ label: v, value: v }))
  }

  if (typeName === 'ZodNativeEnum') {
    const enumObj = def.values as Record<string, string | number>
    return Object.entries(enumObj)
      .filter(([k]) => isNaN(Number(k)))
      .map(([k, v]) => ({ label: k, value: String(v) }))
  }

  return []
}
