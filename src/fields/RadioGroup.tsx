import React from 'react'
import { RadioGroup, RadioGroupItem } from '@booga/vui'
import { FieldWrapper, buildFieldIds, resolveDescribedBy } from './shared'
import type { OptionItem } from '../zod/extractEnumOptions'

export interface RadioGroupFieldProps {
  name: string
  value: string
  onValueChange: (value: string) => void
  onBlur: () => void
  options: OptionItem[]
  label?: string
  help?: string
  error?: string
  disabled?: boolean
}

export function RadioGroupField({
  name,
  value,
  onValueChange,
  onBlur,
  options,
  label,
  help,
  error,
  disabled,
}: RadioGroupFieldProps) {
  const ids = buildFieldIds(name)
  const describedBy = resolveDescribedBy(ids, error, help)
  return (
    <FieldWrapper ids={ids} label={label} help={help} error={error}>
      <RadioGroup
        id={ids.fieldId}
        name={name}
        value={value}
        onValueChange={onValueChange}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        {options.map(({ label: optLabel, value: optValue }) => (
          <RadioGroupItem
            key={optValue}
            value={optValue}
            label={optLabel}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
    </FieldWrapper>
  )
}
