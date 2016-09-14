# vForms

Schema-driven form primitives. Zod schema as source of truth — field types inferred, validation wired, accessibility baked in. Built on react-hook-form + vUi.

## Install

```sh
npm install @booga/vforms
```

## Usage

```tsx
import { z } from 'zod'
import { Form, Field, Submit, Reset } from '@booga/vforms'

const schema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
  active: z.boolean(),
})

function MyForm() {
  return (
    <Form schema={schema} onSubmit={console.log} defaultValues={{ active: true }}>
      <Field name="email" label="Email" />
      <Field name="role" label="Role" />
      <Field name="active" label="Active" />
      <Submit />
      <Reset />
    </Form>
  )
}
```

## Field dispatch

| Zod type | Rendered primitive |
|---|---|
| `z.string()` | `<input type="text">` |
| `z.number()` | `<input type="number">` |
| `z.boolean()` | `<button role="switch">` |
| `z.enum()` / `z.nativeEnum()` | `<select>` |
| `z.date()` | `<input type="date">` |

Wrappers (`optional`, `nullable`, `default`, `refine`, `transform`, `pipe`, `brand`, `catch`) are recursively stripped — the inner type drives dispatch.

## Custom field override

```tsx
<Field name="bio" as={MyCustomInput} multiline />
```

Custom components receive `ControlledFieldProps`: `value`, `onChange`, `onBlur`, `name`, `id`, `aria-invalid`, `aria-describedby`.

## Config schema

```ts
import { VFormsConfigSchema } from '@booga/vforms'

VFormsConfigSchema.parse({
  validationMode: 'onChange',  // 'onSubmit' | 'onChange' | 'onBlur'
  resetOnSuccess: true,
})
```

## Layout helpers

`FieldGroup` — `<fieldset>` with optional `legend`, groups related fields semantically.
`FieldRow` — horizontal flex container for side-by-side fields.

## Primitives (direct use)

`InputField`, `TextareaField`, `SelectField`, `SwitchField`, `CheckboxField`, `RadioGroupField`, `DatePickerField` — all exported for custom form layouts outside the `Field` dispatcher.

## Code of Conduct

[Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)
