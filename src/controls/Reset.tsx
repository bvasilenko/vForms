import React from 'react'
import { Button } from '@booga/vui'
import { useVFormContext } from '../context'

export interface ResetProps {
  children?: React.ReactNode
}

export function Reset({ children = 'Reset' }: ResetProps) {
  const { methods } = useVFormContext()
  return (
    <Button type="button" onClick={() => methods.reset()}>
      {children}
    </Button>
  )
}
