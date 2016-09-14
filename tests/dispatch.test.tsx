import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { ZodTypeAny } from 'zod'
import { Field, Form } from '../src'

afterEach(cleanup)

function renderField(fieldSchema: ZodTypeAny, multiline = false) {
  const schema = z.object({ value: fieldSchema })
  render(
    <Form schema={schema} onSubmit={vi.fn()}>
      <Field name="value" multiline={multiline} />
    </Form>,
  )
}

describe('Primitive type dispatch', () => {
  it('z.string() → text input', () => {
    renderField(z.string())
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('textbox').tagName).toBe('INPUT')
  })

  it('z.number() → number input (spinbutton)', () => {
    renderField(z.number())
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })

  it('z.boolean() → switch button', () => {
    renderField(z.boolean())
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('z.enum() → combobox select', () => {
    renderField(z.enum(['a', 'b', 'c']))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('z.enum() → select populated with all enum values as options', () => {
    renderField(z.enum(['admin', 'user', 'viewer']))
    expect(screen.getByRole('option', { name: 'admin' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'user' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'viewer' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('z.nativeEnum() → combobox select with enum keys as labels', () => {
    enum Role { Admin = 'admin', User = 'user' }
    renderField(z.nativeEnum(Role))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Admin' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'User' })).toBeInTheDocument()
  })

  it('z.date() → date input', () => {
    renderField(z.date())
    const input = document.querySelector('input[type="date"]')
    expect(input).toBeInTheDocument()
  })

  it('z.string() with multiline=true → textarea', () => {
    renderField(z.string(), true)
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA')
  })

  it('unrecognized Zod type (z.union) → text input fallback', () => {
    renderField(z.union([z.string(), z.number()]))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})

describe('Transparent Zod wrapper unwrapping', () => {
  const stringWrappers: Array<[string, ZodTypeAny]> = [
    ['ZodOptional', z.string().optional()],
    ['ZodNullable', z.string().nullable()],
    ['ZodDefault', z.string().default('x')],
    ['ZodEffects/refine', z.string().refine(v => v.length >= 0)],
    ['ZodEffects/transform', z.string().transform(v => v.trim())],
    ['ZodPipeline', z.string().pipe(z.string())],
    ['ZodCatch', z.string().catch('')],
    ['ZodReadonly', z.string().readonly()],
    ['ZodBranded', z.string().brand()],
    ['ZodLazy', z.lazy(() => z.string())],
    ['chain Default→Optional', z.string().default('x').optional()],
    ['chain Nullable→Default', z.string().nullable().default(null)],
    ['chain Optional→Refine→String', z.string().refine(v => !!v).optional()],
  ]

  it.each(stringWrappers)('unwraps %s around z.string() → text input', (_, fieldSchema) => {
    renderField(fieldSchema)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    cleanup()
  })

  it('unwraps ZodOptional around z.boolean() → switch (not text input)', () => {
    renderField(z.boolean().optional())
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('unwraps ZodOptional around z.enum() → combobox (not text input)', () => {
    renderField(z.enum(['x', 'y']).optional())
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('unwraps ZodDefault around z.number() → number input', () => {
    renderField(z.number().default(0))
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('wrapper chain exceeding MAX_DEPTH (10) falls back to text input', () => {
    let schema: ZodTypeAny = z.string()
    for (let i = 0; i < 11; i++) schema = schema.optional()
    renderField(schema)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    cleanup()
  })
})
