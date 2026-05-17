// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'
import { FormProvider } from 'react-hook-form'
import type { ZodObject, ZodRawShape, z } from 'zod'
import { VFormContext } from './context'
import { useForm } from './useForm'
import type { VFormsConfig } from './config'

export interface FormProps<T extends ZodObject<ZodRawShape>> {
  schema: T
  onSubmit: (values: z.infer<T>) => void
  defaultValues?: Partial<z.infer<T>>
  mode?: VFormsConfig['validationMode']
  resetOnSuccess?: boolean
  children: React.ReactNode
}

export function Form<T extends ZodObject<ZodRawShape>>({
  schema,
  onSubmit,
  defaultValues,
  mode = 'onSubmit',
  resetOnSuccess = false,
  children,
}: FormProps<T>) {
  const methods = useForm({
    schema,
    defaultValues: defaultValues as any,
    mode,
  })
  const { handleSubmit, reset } = methods

  const submitHandler = handleSubmit((values) => {
    onSubmit(values)
    if (resetOnSuccess) reset()
  })

  return (
    <FormProvider {...methods}>
      <VFormContext.Provider value={{ schema, methods: methods as any }}>
        <form onSubmit={submitHandler} noValidate>
          {children}
        </form>
      </VFormContext.Provider>
    </FormProvider>
  )
}
