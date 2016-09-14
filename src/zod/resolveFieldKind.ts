import type { ZodTypeAny } from 'zod'
import { unwrapZodType } from './unwrapZodType'

export type FieldKind = 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'unknown'

const ZOD_TYPE_TO_KIND: Record<string, FieldKind> = {
  ZodString: 'string',
  ZodNumber: 'number',
  ZodBoolean: 'boolean',
  ZodEnum: 'enum',
  ZodNativeEnum: 'enum',
  ZodDate: 'date',
}

export function resolveFieldKind(schema: ZodTypeAny): FieldKind {
  const inner = unwrapZodType(schema)
  const typeName = (inner._def as Record<string, string>).typeName
  return ZOD_TYPE_TO_KIND[typeName] ?? 'unknown'
}
