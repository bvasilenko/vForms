// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { Form, Field, Reset, Submit } from '../src'

describe('Form reset behaviour', () => {
  it('Reset button returns text field to defaultValue', async () => {
    const schema = z.object({ name: z.string() })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ name: 'initial' }}>
        <Field name="name" />
        <Reset />
      </Form>,
    )

    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'changed')
    expect(input).toHaveValue('changed')

    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(input).toHaveValue('initial')
  })

  it('Reset clears validation errors shown after a failed submit', async () => {
    const schema = z.object({ name: z.string().min(1, 'Required') })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ name: '' }}>
        <Field name="name" />
        <Submit />
        <Reset />
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByText('Required')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /reset/i }))
    await waitFor(() => expect(screen.queryByText('Required')).toBeNull())
  })

  it('Reset without defaultValues returns to empty state', async () => {
    const schema = z.object({ tag: z.string() })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="tag" />
        <Reset />
      </Form>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'hello')
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(input).toHaveValue('')
  })

  it('Reset returns boolean switch to its defaultValue', async () => {
    const schema = z.object({ active: z.boolean() })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ active: false }}>
        <Field name="active" />
        <Reset />
      </Form>,
    )

    const toggle = screen.getByRole('switch')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('button', { name: /reset/i }))
    await waitFor(() => expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false'))
  })

  it('Reset returns enum select to its defaultValue', async () => {
    const schema = z.object({ role: z.enum(['admin', 'user', 'viewer']) })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ role: 'admin' }}>
        <Field name="role" />
        <Reset />
      </Form>,
    )

    await user.selectOptions(screen.getByRole('combobox'), 'user')
    expect(screen.getByRole('combobox')).toHaveValue('user')

    await user.click(screen.getByRole('button', { name: /reset/i }))
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('admin'))
  })
})
