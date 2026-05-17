// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'

export interface FieldGroupProps {
  legend?: string
  children: React.ReactNode
}

export function FieldGroup({ legend, children }: FieldGroupProps) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      {legend && <legend>{legend}</legend>}
      {children}
    </fieldset>
  )
}
