// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { Form, Field, Submit } from '../src'

describe('Form submit behaviour', () => {
  it('blocks submission and shows errors when validation fails', async () => {
    const schema = z.object({ email: z.string().email('Invalid email') })
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={onSubmit}>
        <Field name="email" />
        <Submit />
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByText('Invalid email')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with parsed values on valid submission', async () => {
    const schema = z.object({ username: z.string().min(1) })
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={onSubmit}>
        <Field name="username" />
        <Submit />
      </Form>,
    )

    await user.type(screen.getByRole('textbox'), 'alice')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith({ username: 'alice' })
  })

  it('resets after successful submit when resetOnSuccess is true', async () => {
    const schema = z.object({ note: z.string() })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} resetOnSuccess>
        <Field name="note" />
        <Submit />
      </Form>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'hello')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(input).toHaveValue('')
  })

  it('onChange mode reports errors while typing', async () => {
    const schema = z.object({ code: z.string().min(3, 'Too short') })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} mode="onChange">
        <Field name="code" />
      </Form>,
    )

    await user.type(screen.getByRole('textbox'), 'ab')
    expect(await screen.findByText('Too short')).toBeInTheDocument()
  })

  it('onBlur mode shows errors after blur without requiring a submit', async () => {
    const schema = z.object({ name: z.string().min(1, 'Required') })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} mode="onBlur">
        <Field name="name" />
      </Form>,
    )

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.tab()
    expect(await screen.findByText('Required')).toBeInTheDocument()
  })

  it('onChange mode error disappears once the field value becomes valid', async () => {
    const schema = z.object({ code: z.string().min(3, 'Too short') })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} mode="onChange">
        <Field name="code" />
        <Submit />
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByText('Too short')).toBeInTheDocument()

    await user.type(screen.getByRole('textbox'), 'abc')
    await waitFor(() => expect(screen.queryByText('Too short')).toBeNull())
  })

  it('shows errors for all invalid fields simultaneously on submit', async () => {
    const schema = z.object({
      email: z.string().email('Bad email'),
      age: z.number({ invalid_type_error: 'Bad number' }),
    })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="email" />
        <Field name="age" />
        <Submit />
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByText('Bad email')).toBeInTheDocument()
    expect(await screen.findByText('Bad number')).toBeInTheDocument()
  })
})
