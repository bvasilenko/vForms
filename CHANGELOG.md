# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-17

### Added

- `Form` — root provider: Zod schema + react-hook-form context, `onSubmit`, `defaultValues`, `mode`, `resetOnSuccess`
- `Field` — discriminated dispatcher: `z.string` → Input, `z.boolean` → Switch, `z.enum`/`z.nativeEnum` → Select, `z.number` → Input[number], `z.date` → DatePicker; `multiline` flag → Textarea; `as={Component}` override via Controller
- `useForm` — react-hook-form wrapper with zodResolver pre-wired; exposes `errors` convenience alias
- `Submit`, `Reset` — form action buttons wired to form context
- `FieldGroup`, `FieldRow` — layout helpers (fieldset + flex row)
- `InputField`, `TextareaField`, `SelectField`, `SwitchField`, `CheckboxField`, `RadioGroupField`, `DatePickerField` — vUi-backed field primitives with ARIA wiring
- `VFormsConfigSchema` — Zod config schema for `validationMode` and `resetOnSuccess`
- `unwrapZodType`, `resolveFieldKind`, `extractEnumOptions` — Zod introspection utilities (public for composability)
- Full ARIA: `aria-invalid`, `aria-describedby`, `htmlFor` linkage on all field primitives
- Recursive Zod wrapper unwrapping: `ZodOptional`, `ZodNullable`, `ZodDefault`, `ZodCatch`, `ZodReadonly`, `ZodBranded`, `ZodEffects`, `ZodPipeline`, `ZodLazy` all transparently resolved
