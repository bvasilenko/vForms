// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'
import { Button } from '@booga/vui'

export interface SubmitProps {
  children?: React.ReactNode
}

export function Submit({ children = 'Submit' }: SubmitProps) {
  return <Button type="submit">{children}</Button>
}
