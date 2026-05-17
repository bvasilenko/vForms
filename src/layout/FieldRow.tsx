// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'

export interface FieldRowProps {
  children: React.ReactNode
}

export function FieldRow({ children }: FieldRowProps) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {children}
    </div>
  )
}
