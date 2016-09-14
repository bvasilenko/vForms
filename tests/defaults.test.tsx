import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { Form, Field } from '../src'

describe('Default values', () => {
  it('string defaultValue populates text input', () => {
    const schema = z.object({ name: z.string() })
    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ name: 'Alice' }}>
        <Field name="name" />
      </Form>,
    )
    expect(screen.getByRole('textbox')).toHaveValue('Alice')
  })

  it('boolean defaultValue true pre-checks the switch', () => {
    const schema = z.object({ active: z.boolean() })
    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ active: true }}>
        <Field name="active" />
      </Form>,
    )
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('enum defaultValue pre-selects the select option', () => {
    const schema = z.object({ role: z.enum(['admin', 'user', 'viewer']) })
    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ role: 'user' }}>
        <Field name="role" />
      </Form>,
    )
    expect(screen.getByRole('combobox')).toHaveValue('user')
  })

  it('number defaultValue populates the number input', () => {
    const schema = z.object({ count: z.number() })
    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ count: 42 }}>
        <Field name="count" />
      </Form>,
    )
    expect(screen.getByRole('spinbutton')).toHaveValue(42)
  })

  it('boolean defaultValue false leaves switch in unchecked state', () => {
    const schema = z.object({ active: z.boolean() })
    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ active: false }}>
        <Field name="active" />
      </Form>,
    )
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('multiple fields all receive their defaultValues', () => {
    const schema = z.object({
      first: z.string(),
      last: z.string(),
    })
    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ first: 'Ada', last: 'Lovelace' }}>
        <Field name="first" />
        <Field name="last" />
      </Form>,
    )
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('Ada')
    expect(inputs[1]).toHaveValue('Lovelace')
  })
})
