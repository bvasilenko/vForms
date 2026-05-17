// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { Form, Field, Submit, useForm } from '../src'

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

  it('form element renders with noValidate to suppress browser-native validation', () => {
    const schema = z.object({ name: z.string() })
    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="name" />
      </Form>,
    )
    expect(document.querySelector('form')).toHaveAttribute('novalidate')
  })

  it('does not auto-reset after successful submit when resetOnSuccess is false', async () => {
    const schema = z.object({ note: z.string() })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} resetOnSuccess={false}>
        <Field name="note" />
        <Submit />
      </Form>,
    )

    await user.type(screen.getByRole('textbox'), 'hello')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })

  it('useForm without explicit mode defaults to onSubmit validation semantics', async () => {
    const schema = z.object({ name: z.string().min(1, 'Required') })

    function DirectForm({ onSubmit }: { onSubmit: (v: { name: string }) => void }) {
      const { register, handleSubmit, errors } = useForm({ schema })
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('name')} aria-invalid={!!errors.name} />
          {errors.name?.message && <span role="alert">{errors.name.message}</span>}
          <button type="submit">submit</button>
        </form>
      )
    }

    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<DirectForm onSubmit={onSubmit} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'x')
    await user.clear(input)
    expect(screen.queryByRole('alert')).toBeNull()

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Required')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
