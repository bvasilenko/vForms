import React, { forwardRef } from 'react'
import { Select, SelectItem } from '@booga/vui'
import type { SelectProps } from '@booga/vui'
import { FieldWrapper, buildFieldIds, resolveDescribedBy } from './shared'
import type { OptionItem } from '../zod/extractEnumOptions'

export interface SelectFieldProps extends Omit<SelectProps, 'id' | 'name' | 'children'> {
  name: string
  options: OptionItem[]
  label?: string
  help?: string
  error?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ name, options, label, help, error, ...selectProps }, ref) {
    const ids = buildFieldIds(name)
    const describedBy = resolveDescribedBy(ids, error, help)
    return (
      <FieldWrapper ids={ids} label={label} help={help} error={error}>
        <Select
          ref={ref}
          id={ids.fieldId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...selectProps}
        >
          {options.map(({ label: optLabel, value }) => (
            <SelectItem key={value} value={value}>
              {optLabel}
            </SelectItem>
          ))}
        </Select>
      </FieldWrapper>
    )
  },
)
