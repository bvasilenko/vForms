import type { ZodTypeAny } from 'zod'

const INNER_FIELD: Record<string, string> = {
  ZodOptional: 'innerType',
  ZodNullable: 'innerType',
  ZodDefault: 'innerType',
  ZodCatch: 'innerType',
  ZodReadonly: 'innerType',
  ZodBranded: 'type',
  ZodEffects: 'schema',
  ZodPipeline: 'in',
}

const MAX_DEPTH = 10

function getInnerType(schema: ZodTypeAny): ZodTypeAny | null {
  const def = schema._def as Record<string, unknown>
  const typeName = def.typeName as string

  if (typeName in INNER_FIELD) {
    return def[INNER_FIELD[typeName]] as ZodTypeAny
  }
  if (typeName === 'ZodLazy') {
    return (def.getter as () => ZodTypeAny)()
  }
  return null
}

export function unwrapZodType(schema: ZodTypeAny, depth = 0): ZodTypeAny {
  if (depth >= MAX_DEPTH) return schema
  const inner = getInnerType(schema)
  return inner ? unwrapZodType(inner, depth + 1) : schema
}
