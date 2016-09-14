import { useForm as useRHFForm } from 'react-hook-form'
import type { DefaultValues } from 'react-hook-form'
import type { ZodObject, ZodRawShape, z } from 'zod'
import { zodResolver } from './resolver'
import type { VFormsConfig } from './config'

export interface UseVFormOptions<T extends ZodObject<ZodRawShape>> {
  schema: T
  defaultValues?: DefaultValues<z.infer<T>>
  mode?: VFormsConfig['validationMode']
}

export function useForm<T extends ZodObject<ZodRawShape>>(options: UseVFormOptions<T>) {
  const methods = useRHFForm<z.infer<T>>({
    resolver: zodResolver(options.schema),
    mode: options.mode ?? 'onSubmit',
    defaultValues: options.defaultValues,
  })
  return { ...methods, errors: methods.formState.errors }
}
