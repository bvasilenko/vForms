// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React, { forwardRef } from 'react'
import { Input } from '@booga/vui'
import type { InputProps } from '@booga/vui'
import { FieldWrapper, buildFieldIds, resolveDescribedBy } from './shared'

export interface InputFieldProps extends Omit<InputProps, 'id' | 'name'> {
  name: string
  label?: string
  help?: string
  error?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ name, label, help, error, ...inputProps }, ref) {
    const ids = buildFieldIds(name)
    const describedBy = resolveDescribedBy(ids, error, help)
    return (
      <FieldWrapper ids={ids} label={label} help={help} error={error}>
        <Input
          ref={ref}
          id={ids.fieldId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
      </FieldWrapper>
    )
  },
)
