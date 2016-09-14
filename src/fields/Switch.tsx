import React from 'react'
import { Switch } from '@booga/vui'
import { FieldWrapper, buildFieldIds, resolveDescribedBy } from './shared'

export interface SwitchFieldProps {
  name: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onBlur: () => void
  label?: string
  help?: string
  error?: string
  disabled?: boolean
}

export function SwitchField({
  name,
  checked,
  onCheckedChange,
  onBlur,
  label,
  help,
  error,
  disabled,
}: SwitchFieldProps) {
  const ids = buildFieldIds(name)
  const describedBy = resolveDescribedBy(ids, error, help)
  return (
    <FieldWrapper ids={ids} label={label} help={help} error={error}>
      <Switch
        id={ids.fieldId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
    </FieldWrapper>
  )
}
