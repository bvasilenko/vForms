import { z } from 'zod'

export const VFormsConfigSchema = z.object({
  validationMode: z.enum(['onSubmit', 'onChange', 'onBlur']).default('onSubmit'),
  resetOnSuccess: z.boolean().default(false),
}).strict()

export type VFormsConfig = z.infer<typeof VFormsConfigSchema>
