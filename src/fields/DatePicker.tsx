import React, { forwardRef } from 'react'
import { Input } from '@booga/vui'
import type { InputProps } from '@booga/vui'
import { FieldWrapper, buildFieldIds, resolveDescribedBy } from './shared'

export interface DatePickerFieldProps extends Omit<InputProps, 'id' | 'name' | 'type'> {
  name: string
  label?: string
  help?: string
  error?: string
}

export const DatePickerField = forwardRef<HTMLInputElement, DatePickerFieldProps>(
  function DatePickerField({ name, label, help, error, ...inputProps }, ref) {
    const ids = buildFieldIds(name)
    const describedBy = resolveDescribedBy(ids, error, help)
    return (
      <FieldWrapper ids={ids} label={label} help={help} error={error}>
        <Input
          ref={ref}
          id={ids.fieldId}
          name={name}
          type="date"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
      </FieldWrapper>
    )
  },
)
