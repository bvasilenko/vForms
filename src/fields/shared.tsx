import React from 'react'
import { Label } from '@booga/vui'

export interface FieldIds {
  fieldId: string
  errorId: string
  helpId: string
}

export function buildFieldIds(name: string): FieldIds {
  return {
    fieldId: name,
    errorId: `${name}-error`,
    helpId: `${name}-help`,
  }
}

export function resolveDescribedBy(
  ids: FieldIds,
  error: string | undefined,
  help: string | undefined,
): string | undefined {
  if (error) return ids.errorId
  if (help) return ids.helpId
  return undefined
}

export interface FieldWrapperProps {
  ids: FieldIds
  label?: string
  help?: string
  error?: string
  children: React.ReactNode
}

export function FieldWrapper({ ids, label, help, error, children }: FieldWrapperProps) {
  return (
    <div>
      {label && <Label htmlFor={ids.fieldId}>{label}</Label>}
      {children}
      {help && !error && <span id={ids.helpId}>{help}</span>}
      <span id={ids.errorId}>{error}</span>
    </div>
  )
}

export interface ControlledFieldProps {
  id: string
  name: string
  value: unknown
  onChange: (value: unknown) => void
  onBlur: () => void
  'aria-invalid'?: true
  'aria-describedby'?: string
}
