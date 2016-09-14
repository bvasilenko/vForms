import React, { forwardRef } from 'react'
import { Checkbox } from '@booga/vui'
import type { CheckboxProps } from '@booga/vui'
import { FieldWrapper, buildFieldIds, resolveDescribedBy } from './shared'

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'id' | 'name'> {
  name: string
  label?: string
  help?: string
  error?: string
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField({ name, label, help, error, ...checkboxProps }, ref) {
    const ids = buildFieldIds(name)
    const describedBy = resolveDescribedBy(ids, error, help)
    return (
      <FieldWrapper ids={ids} label={label} help={help} error={error}>
        <Checkbox
          ref={ref}
          id={ids.fieldId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...checkboxProps}
        />
      </FieldWrapper>
    )
  },
)
