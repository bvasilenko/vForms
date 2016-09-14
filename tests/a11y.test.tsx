import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { Form, Field, Submit } from '../src'

async function triggerValidationError(schema: Parameters<typeof Form>[0]['schema']) {
  const user = userEvent.setup()
  render(
    <Form schema={schema} onSubmit={vi.fn()}>
      <Field name="value" />
      <Submit />
    </Form>,
  )
  await user.click(screen.getByRole('button', { name: /submit/i }))
}

describe('Accessibility contracts', () => {
  it('invalid field gets aria-invalid="true"', async () => {
    const schema = z.object({ value: z.string().min(1, 'Required') })
    await triggerValidationError(schema)
    const input = await screen.findByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('aria-describedby on invalid field links to the error element', async () => {
    const schema = z.object({ value: z.string().min(1, 'Required') })
    await triggerValidationError(schema)
    const input = await screen.findByRole('textbox')
    const errorId = input.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    const errorEl = document.getElementById(errorId!)
    expect(errorEl).toBeInTheDocument()
    expect(errorEl).toHaveTextContent('Required')
  })

  it('valid field has no aria-invalid attribute', () => {
    const schema = z.object({ value: z.string() })
    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="value" />
      </Form>,
    )
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('label htmlFor connects to the field id', () => {
    const schema = z.object({ value: z.string() })
    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="value" label="My Field" />
      </Form>,
    )
    const label = screen.getByText('My Field')
    const input = screen.getByRole('textbox')
    expect(label).toHaveAttribute('for', input.id)
  })

  it('help text is associated via aria-describedby when no error', () => {
    const schema = z.object({ value: z.string() })
    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="value" help="Enter anything" />
      </Form>,
    )
    const input = screen.getByRole('textbox')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent('Enter anything')
  })

  it('error aria-describedby takes precedence over help text when both are present', async () => {
    const schema = z.object({ value: z.string().min(1, 'Required') })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="value" help="Some help" />
        <Submit />
      </Form>,
    )

    const input = screen.getByRole('textbox')
    const helpDescribedBy = input.getAttribute('aria-describedby')
    expect(document.getElementById(helpDescribedBy!)).toHaveTextContent('Some help')

    await user.click(screen.getByRole('button', { name: /submit/i }))
    const errorDescribedBy = (await screen.findByRole('textbox')).getAttribute('aria-describedby')
    expect(document.getElementById(errorDescribedBy!)).toHaveTextContent('Required')
    expect(errorDescribedBy).not.toBe(helpDescribedBy)
  })

  it('select (enum) field gets aria-invalid on validation failure', async () => {
    const schema = z.object({
      role: z.enum(['admin', 'user']).refine((v): boolean => v === 'admin', 'Must be admin'),
    })
    const user = userEvent.setup()

    render(
      <Form schema={schema} onSubmit={vi.fn()} defaultValues={{ role: 'user' }}>
        <Field name="role" />
        <Submit />
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))
    const select = await screen.findByRole('combobox')
    expect(select).toHaveAttribute('aria-invalid', 'true')
  })

  it('Switch field gets aria-invalid on boolean validation failure', async () => {
    const schema = z.object({
      value: z.boolean().refine(v => v === true, 'Must be accepted'),
    })
    const user = userEvent.setup()
    render(
      <Form schema={schema} onSubmit={vi.fn()}>
        <Field name="value" />
        <Submit />
      </Form>,
    )
    await user.click(screen.getByRole('button', { name: /submit/i }))
    const switchEl = await screen.findByRole('switch')
    expect(switchEl).toHaveAttribute('aria-invalid', 'true')
  })
})
