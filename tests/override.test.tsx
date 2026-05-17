// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { Form, Field, Submit } from '../src'
import type { ControlledFieldProps } from '../src'

const CustomInput = vi.fn(function CustomInput({
  value,
  onChange,
  id,
  'aria-invalid': ariaInvalid,
  'aria-describedby': describedBy,
}: ControlledFieldProps) {
  return (
    <input
      data-testid="custom-input"
      id={id}
      value={String(value ?? '')}
      onChange={e => onChange(e.target.value)}
      aria-invalid={ariaInvalid}
      aria-describedby={describedBy}
    />
  )
})

describe('Field as={CustomComponent} override', () => {
  it('calls the custom component and renders its output', () => {
    const schema = z.object({ note: z.string() })
    CustomInput.mockClear()

    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="note" as={CustomInput} />
      </Form>,
    )

    expect(screen.getByTestId('custom-input')).toBeInTheDocument()
    expect(CustomInput).toHaveBeenCalled()
  })

  it('custom component receives value and onChange wired to form state', async () => {
    const schema = z.object({ note: z.string() })
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    CustomInput.mockClear()

    render(
      <Form schema={schema} onSubmit={onSubmit}>
        <Field name="note" as={CustomInput} />
        <Submit />
      </Form>,
    )

    await user.type(screen.getByTestId('custom-input'), 'hello')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalledWith({ note: 'hello' })
  })

  it('custom component receives aria-invalid when validation fails', async () => {
    const schema = z.object({ note: z.string().min(1, 'Required') })
    const user = userEvent.setup()
    CustomInput.mockClear()

    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="note" as={CustomInput} />
        <Submit />
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))
    const input = await screen.findByTestId('custom-input')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('z.boolean() field can override to a custom checkbox component', async () => {
    function CustomCheck({ value, onChange }: ControlledFieldProps) {
      return (
        <input
          data-testid="custom-check"
          type="checkbox"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
        />
      )
    }

    const schema = z.object({ agreed: z.boolean() })
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={onSubmit} defaultValues={{ agreed: false }}>
        <Field name="agreed" as={CustomCheck} />
        <Submit />
      </Form>,
    )

    await user.click(screen.getByTestId('custom-check'))
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalledWith({ agreed: true })
  })

  it('custom component onBlur propagates to Controller so onBlur-mode validation fires', async () => {
    const schema = z.object({ note: z.string().min(1, 'Required') })
    const user = userEvent.setup()

    function BlurCapture({ onBlur, id, 'aria-invalid': ariaInvalid }: ControlledFieldProps) {
      return <input data-testid="blur-input" id={id} onBlur={onBlur} aria-invalid={ariaInvalid} />
    }

    render(
      <Form schema={schema} onSubmit={vi.fn()} mode="onBlur">
        <Field name="note" as={BlurCapture} />
      </Form>,
    )

    const input = screen.getByTestId('blur-input')
    await user.click(input)
    await user.tab()
    await waitFor(() =>
      expect(screen.getByTestId('blur-input')).toHaveAttribute('aria-invalid', 'true'),
    )
  })
})
