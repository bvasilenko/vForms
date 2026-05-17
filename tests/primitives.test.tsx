// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import {
  CheckboxField,
  TextareaField,
  DatePickerField,
  RadioGroupField,
  FieldGroup,
  FieldRow,
  VFormsConfigSchema,
  useVFormContext,
  extractEnumOptions,
} from '../src'

const noop = vi.fn()

describe('Field primitives — direct usage', () => {
  it('TextareaField renders a textarea with label and error', () => {
    render(
      <form>
        <TextareaField name="bio" label="Bio" error="Too long" />
      </form>,
    )
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA')
    expect(screen.getByText('Bio')).toBeInTheDocument()
    expect(screen.getByText('Too long')).toBeInTheDocument()
  })

  it('DatePickerField renders an input[type=date]', () => {
    render(
      <form>
        <DatePickerField name="dob" label="Date of birth" />
      </form>,
    )
    const input = document.getElementById('dob')
    expect(input).toHaveAttribute('type', 'date')
    expect(screen.getByText('Date of birth')).toBeInTheDocument()
  })

  it('CheckboxField renders an input[type=checkbox]', () => {
    render(
      <form>
        <CheckboxField name="agreed" label="I agree" />
      </form>,
    )
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByText('I agree')).toBeInTheDocument()
  })

  it('RadioGroupField renders radio options', () => {
    render(
      <form>
        <RadioGroupField
          name="color"
          value="red"
          onValueChange={noop}
          onBlur={noop}
          options={[
            { label: 'Red', value: 'red' },
            { label: 'Blue', value: 'blue' },
          ]}
          label="Color"
        />
      </form>,
    )
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  it('RadioGroupField shows error and sets aria-invalid', () => {
    render(
      <form>
        <RadioGroupField
          name="size"
          value=""
          onValueChange={noop}
          onBlur={noop}
          options={[{ label: 'S', value: 's' }]}
          error="Required"
        />
      </form>,
    )
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})

describe('Layout helpers', () => {
  it('FieldGroup renders a fieldset with legend', () => {
    render(<FieldGroup legend="Personal info"><span>child</span></FieldGroup>)
    const fieldset = screen.getByRole('group')
    expect(fieldset.tagName).toBe('FIELDSET')
    expect(screen.getByText('Personal info')).toBeInTheDocument()
  })

  it('FieldGroup renders without legend', () => {
    render(<FieldGroup><span>child</span></FieldGroup>)
    expect(screen.getByRole('group')).toBeInTheDocument()
    expect(screen.queryByRole('legend')).toBeNull()
  })

  it('FieldRow renders children in a div', () => {
    render(
      <FieldRow>
        <span>a</span>
        <span>b</span>
      </FieldRow>,
    )
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
  })
})

describe('VFormsConfigSchema validation', () => {
  it('parses a fully-specified valid config', () => {
    const result = VFormsConfigSchema.parse({ validationMode: 'onBlur', resetOnSuccess: true })
    expect(result).toEqual({ validationMode: 'onBlur', resetOnSuccess: true })
  })

  it('applies defaults when no fields are provided', () => {
    const result = VFormsConfigSchema.parse({})
    expect(result).toEqual({ validationMode: 'onSubmit', resetOnSuccess: false })
  })

  it('rejects unknown keys (strict schema)', () => {
    expect(() => VFormsConfigSchema.parse({ unknown: true })).toThrow()
  })

  it('rejects an invalid validationMode value', () => {
    expect(() => VFormsConfigSchema.parse({ validationMode: 'onHover' })).toThrow()
  })
})

describe('useVFormContext', () => {
  it('throws a descriptive error when called outside <Form>', () => {
    function Probe() {
      useVFormContext()
      return null
    }
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow('useVFormContext must be called inside <Form>')
    consoleSpy.mockRestore()
  })
})

describe('extractEnumOptions', () => {
  it('returns an empty array for a non-enum schema', () => {
    expect(extractEnumOptions(z.string())).toEqual([])
  })

  it('returns label/value pairs from ZodEnum values', () => {
    expect(extractEnumOptions(z.enum(['a', 'b']))).toEqual([
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b' },
    ])
  })
})
