import { createContext, useContext } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { ZodObject, ZodRawShape } from 'zod'

export interface VFormContextValue {
  schema: ZodObject<ZodRawShape>
  methods: UseFormReturn<any>
}

const VFormContext = createContext<VFormContextValue | null>(null)

export function useVFormContext(): VFormContextValue {
  const ctx = useContext(VFormContext)
  if (ctx === null) throw new Error('useVFormContext must be called inside <Form>')
  return ctx
}

export { VFormContext }
