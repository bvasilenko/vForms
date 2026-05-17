// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'
import { Controller } from 'react-hook-form'
import type { ComponentType } from 'react'
import type { FieldError } from 'react-hook-form'
import { useVFormContext } from './context'
import { resolveFieldKind } from './zod/resolveFieldKind'
import { extractEnumOptions } from './zod/extractEnumOptions'
import { buildFieldIds, resolveDescribedBy } from './fields/shared'
import type { ControlledFieldProps } from './fields/shared'
import { InputField } from './fields/Input'
import { TextareaField } from './fields/Textarea'
import { SelectField } from './fields/Select'
import { SwitchField } from './fields/Switch'
import { DatePickerField } from './fields/DatePicker'

export interface FieldProps {
  name: string
  label?: string
  help?: string
  as?: ComponentType<ControlledFieldProps>
  multiline?: boolean
}

export function Field({ name, label, help, as: CustomComponent, multiline = false }: FieldProps) {
  const { schema, methods } = useVFormContext()
  const { register, control, formState } = methods
  const fieldSchema = schema.shape[name]
  const error = (formState.errors[name] as FieldError | undefined)?.message
  const ids = buildFieldIds(name)
  const describedBy = resolveDescribedBy(ids, error, help)

  if (CustomComponent) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CustomComponent
            id={ids.fieldId}
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
          />
        )}
      />
    )
  }

  const kind = resolveFieldKind(fieldSchema)

  if (kind === 'boolean') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SwitchField
            name={name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            label={label}
            help={help}
            error={error}
          />
        )}
      />
    )
  }

  if (kind === 'enum') {
    const options = extractEnumOptions(fieldSchema)
    const registration = register(name)
    return (
      <SelectField
        {...registration}
        options={options}
        label={label}
        help={help}
        error={error}
      />
    )
  }

  if (kind === 'date') {
    const registration = register(name)
    return (
      <DatePickerField
        {...registration}
        label={label}
        help={help}
        error={error}
      />
    )
  }

  if (kind === 'number') {
    const registration = register(name, { valueAsNumber: true })
    return (
      <InputField
        {...registration}
        type="number"
        label={label}
        help={help}
        error={error}
      />
    )
  }

  if (multiline) {
    const registration = register(name)
    return (
      <TextareaField
        {...registration}
        label={label}
        help={help}
        error={error}
      />
    )
  }

  const registration = register(name)
  return (
    <InputField
      {...registration}
      type="text"
      label={label}
      help={help}
      error={error}
    />
  )
}
