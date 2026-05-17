// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React, { forwardRef } from 'react'
import { Textarea } from '@booga/vui'
import type { TextareaProps } from '@booga/vui'
import { FieldWrapper, buildFieldIds, resolveDescribedBy } from './shared'

export interface TextareaFieldProps extends Omit<TextareaProps, 'id' | 'name'> {
  name: string
  label?: string
  help?: string
  error?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ name, label, help, error, ...textareaProps }, ref) {
    const ids = buildFieldIds(name)
    const describedBy = resolveDescribedBy(ids, error, help)
    return (
      <FieldWrapper ids={ids} label={label} help={help} error={error}>
        <Textarea
          ref={ref}
          id={ids.fieldId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...textareaProps}
        />
      </FieldWrapper>
    )
  },
)
