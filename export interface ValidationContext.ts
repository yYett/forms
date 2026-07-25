export interface ValidationContext {
  value:      any
  params:     Record<string, any>
  field:      { id: string; name: string; label: string }
  formValues: Record<string, any>
  t?:         (key: string, vars?: object) => string
}

export interface Validator {
  name:          string
  normalize?:    (value: any) => any
  validate?:     (ctx: ValidationContext) => string | null
  validateAsync?:(ctx: ValidationContext) => Promise<string | null>
  debounce?:     number
}

import type { Validator } from './types'
import { type InjectionKey, inject, provide } from 'vue'

export class ValidatorRegistry {
  private map = new Map<string, Validator>()

  register(v: Validator) { this.map.set(v.name, v); return this }
  get(name: string)       { return this.map.get(name) }
  clone() {
    const r = new ValidatorRegistry()
    for (const [k, v] of this.map) r.map.set(k, v)
    return r
  }
}

export const REGISTRY_KEY: InjectionKey<ValidatorRegistry> = Symbol('validatorRegistry')
export const provideRegistry = (r: ValidatorRegistry) => provide(REGISTRY_KEY, r)
export const injectRegistry  = () => {
  const r = inject(REGISTRY_KEY)
  if (!r) throw new Error('No ValidatorRegistry — call provideRegistry() at app root')
  return r
}

export type DateFormat = 'iso' | 'dmy' | 'mdy' | 'auto'

export function normalizeDate(value: string, format: DateFormat = 'auto'): Date | null {
  if (!value) return null
  const s = value.trim()
  if (s === 'today')    return new Date()
  if (s === 'tomorrow') { const d = new Date(); d.setDate(d.getDate() + 1); return d }

  if (format === 'iso' || (format === 'auto' && /^\d{4}-\d{2}-\d{2}/.test(s))) {
    const d = new Date(s); return isNaN(d.getTime()) ? null : d
  }
  if (format === 'dmy') {
    const m = /^(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{4})/.exec(s)
    if (m) return new Date(+m[3], +m[2] - 1, +m[1])
  }
  if (format === 'mdy') {
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s)
    if (m) return new Date(+m[3], +m[1] - 1, +m[2])
  }
  const d = new Date(s); return isNaN(d.getTime()) ? null : d
}

export function toDateOnly(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

export function formatDateForMessage(raw: string, locale = 'en-GB'): string {
  const d = normalizeDate(raw)
  if (!d) return raw
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

import { formatDateForMessage } from './normalizeDate'

type MsgFn = (p: Record<string, any>) => string
const map: Record<string, string | MsgFn> = {
  'required':               'This field is required',
  'email.invalid':          'Enter a valid email address',
  'date.invalid':           'Enter a valid date',
  'length.min':             ({ min })        => `Minimum ${min} characters`,
  'length.max':             ({ max })        => `Maximum ${max} characters`,
  'length.exact':           ({ exact })      => `Must be exactly ${exact} characters`,
  'range.min':              ({ min })        => `Must be at least ${min}`,
  'range.max':              ({ max })        => `Must be at most ${max}`,
  'range.nan':              'Must be a number',
  'gt.failed':              ({ fieldLabel }) => `Must be greater than ${fieldLabel}`,
  'gte.failed':             ({ fieldLabel }) => `Must be ${fieldLabel} or more`,
  'lt.failed':              ({ fieldLabel }) => `Must be less than ${fieldLabel}`,
  'lte.failed':             ({ fieldLabel }) => `Must be ${fieldLabel} or less`,
  'sameAs.mismatch':        ({ fieldLabel }) => `Must match ${fieldLabel}`,
  'unique.taken':           'Already taken',
  'dateAfter.failed':       ({ fieldLabel }) => `Must be after ${fieldLabel}`,
  'dateAfterOrEqual.failed':({ fieldLabel }) => `Must be ${fieldLabel} or later`,
  'dateBefore.failed':      ({ fieldLabel }) => `Must be before ${fieldLabel}`,
  'dateMin.failed':         ({ date, locale }) => `Must be on or after ${formatDateForMessage(date, locale)}`,
  'dateMax.failed':         ({ date, locale }) => `Must be on or before ${formatDateForMessage(date, locale)}`,
}

export function resolveMessage(
  key: string | null,
  params: Record<string, any>,
  
  : Record<string, string> = {},
  t?: (k: string, v?: object) => string,
): string | null {
  if (!key) return null

  // enrich params with label of referenced field
  const enriched = { ...params }
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'string' && v.startsWith('$')) {
      enriched.fieldLabel = fieldLabelMap[v.slice(1)] ?? v.slice(1)
    }
  }

  if (t) return t(key, enriched)
  const m = map[key]
  if (!m) return key
  return typeof m === 'function' ? m(enriched) : m
}

import type { Validator } from './types'
import { normalizeDate, toDateOnly } from './normalizeDate'
import type { ValidatorRegistry } from './registry'

function resolveParam(val: any, formValues: Record<string, any>): any {
  return typeof val === 'string' && val.startsWith('$')
    ? formValues[val.slice(1)]
    : val
}

const builtins: Validator[] = [
  {
    name: 'required',
    validate({ value }) {
      if (Array.isArray(value))      return value.length     ? null : 'required'
      if (typeof value === 'number') return isFinite(value)  ? null : 'required'
      return value !== '' && value != null ? null : 'required'
    },
  },
  {
    name: 'email',
    normalize: (v) => v?.trim(),
    validate({ value }) {
      if (!value) return null
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'email.invalid'
    },
  },
  {
    name: 'length',
    normalize: (v) => typeof v === 'string' ? v.trim() : v,
    validate({ value, params: { min, max, exact } }) {
      if (!value) return null
      const len = String(value).length
      if (exact != null && len !== exact) return 'length.exact'
      if (min   != null && len < min)     return 'length.min'
      if (max   != null && len > max)     return 'length.max'
      return null
    },
  },
  {
    name: 'range',
    validate({ value, params: { min, max } }) {
      if (value === '' || value == null) return null
      const n = Number(value)
      if (isNaN(n))           return 'range.nan'
      if (min != null && n < min) return 'range.min'
      if (max != null && n > max) return 'range.max'
      return null
    },
  },
  // --- relational (numeric) ---
  {
    name: 'gt',
    validate({ value, params, formValues }) {
      if (value === '' || value == null) return null
      const threshold = resolveParam(params.field ?? params.value, formValues)
      if (threshold === '' || threshold == null) return null
      return Number(value) > Number(threshold) ? null : 'gt.failed'
    },
  },
  {
    name: 'gte',
    validate({ value, params, formValues }) {
      if (value === '' || value == null) return null
      const threshold = resolveParam(params.field ?? params.value, formValues)
      if (threshold === '' || threshold == null) return null
      return Number(value) >= Number(threshold) ? null : 'gte.failed'
    },
  },
  {
    name: 'lt',
    validate({ value, params, formValues }) {
      if (value === '' || value == null) return null
      const threshold = resolveParam(params.field ?? params.value, formValues)
      if (threshold === '' || threshold == null) return null
      return Number(value) < Number(threshold) ? null : 'lt.failed'
    },
  },
  // --- cross-field ---
  {
    name: 'sameAs',
    validate({ value, params, formValues }) {
      return value === formValues[params.field] ? null : 'sameAs.mismatch'
    },
  },
  {
    name: 'requiredIf',
    validate({ value, params, formValues }) {
      const active = params.equals !== undefined
        ? formValues[params.field] === params.equals
        : Boolean(formValues[params.field])
      if (!active) return null
      return value !== '' && value != null ? null : 'required'
    },
  },
  // --- date ---
  {
    name: 'dateAfter',
    validate({ value, params, formValues }) {
      if (!value) return null
      const fmt  = params.format ?? 'auto'
      const self = normalizeDate(value, fmt)
      if (!self) return 'date.invalid'
      const ref  = normalizeDate(resolveParam(params.field, formValues), fmt)
      if (!ref)  return null
      return toDateOnly(self) > toDateOnly(ref) ? null : 'dateAfter.failed'
    },
  },
  {
    name: 'dateAfterOrEqual',
    validate({ value, params, formValues }) {
      if (!value) return null
      const fmt  = params.format ?? 'auto'
      const self = normalizeDate(value, fmt)
      if (!self) return 'date.invalid'
      const ref  = normalizeDate(resolveParam(params.field, formValues), fmt)
      if (!ref)  return null
      return toDateOnly(self) >= toDateOnly(ref) ? null : 'dateAfterOrEqual.failed'
    },
  },
  {
    name: 'dateBefore',
    validate({ value, params, formValues }) {
      if (!value) return null
      const fmt  = params.format ?? 'auto'
      const self = normalizeDate(value, fmt)
      if (!self) return 'date.invalid'
      const ref  = normalizeDate(resolveParam(params.field, formValues), fmt)
      if (!ref)  return null
      return toDateOnly(self) < toDateOnly(ref) ? null : 'dateBefore.failed'
    },
  },
  {
    name: 'dateMin',
    validate({ value, params }) {
      if (!value) return null
      const fmt  = params.format ?? 'auto'
      const self = normalizeDate(value, fmt)
      if (!self) return 'date.invalid'
      const min  = normalizeDate(params.date, fmt)
      if (!min)  return null
      return toDateOnly(self) >= toDateOnly(min) ? null : 'dateMin.failed'
    },
  },
  {
    name: 'dateMax',
    validate({ value, params }) {
      if (!value) return null
      const fmt  = params.format ?? 'auto'
      const self = normalizeDate(value, fmt)
      if (!self) return 'date.invalid'
      const max  = normalizeDate(params.date, fmt)
      if (!max)  return null
      return toDateOnly(self) <= toDateOnly(max) ? null : 'dateMax.failed'
    },
  },
  // --- async ---
  {
    name: 'unique',
    debounce: 400,
    async validateAsync({ value, params }) {
      if (!value) return null
      const res = await fetch(`${params.api}?value=${encodeURIComponent(value)}`)
      const { available } = await res.json()
      return available ? null : 'unique.taken'
    },
  },
]

export function registerBuiltins(registry: ValidatorRegistry) {
  builtins.forEach(v => registry.register(v))
  return registry
}

import { injectRegistry }            from './validators/registry'
import { resolveMessage }            from './validators/messages'
import type { ValidationContext }    from './validators/types'

export function useValidation(fields: any[], state: Record<string, any>) {
  const registry = injectRegistry()

  // label map for enriched error messages: name → label
    const labelMap = Object.fromEntries(fields.map(f => [f.name, f.label]))

  // compile once: fieldId → [{name, params, hasAsync}]
  type Entry = { name: string; params: Record<string, any>; hasAsync: boolean }
  // const compiled = new Map<string, Entry[]>()

  // for (const field of fields) {
  //   if (!field.validators?.length) continue
  //   compiled.set(field.id, field.validators.map(([name, params = {}]: [string, any]) => ({
  //     name,
  //     params,
  //     hasAsync: Boolean(registry.get(name)?.validateAsync),
  //   })))
  // }

  // reverse dep map: fieldName → fieldIds that reference it in their validators
  // const validationDeps = new Map<string, string[]>()
  // for (const field of fields) {
  //   for (const [, params = {}] of field.validators ?? []) {
  //     for (const val of Object.values(params as Record<string, any>)) {
  //       if (typeof val === 'string' && val.startsWith('$')) {
  //         const refName = val.slice(1)
  //         const list    = validationDeps.get(refName) ?? []
  //         list.push(field.id)
  //         validationDeps.set(refName, list)
  //       }
  //     }
  //   }
  // }

  const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()

  // function buildCtx(id: string, value: any, field: any, params: any): ValidationContext {
  //   return {
  //     value,
  //     params,
  //     field: { id, name: field.name, label: field.label },
  //     formValues: Object.fromEntries(fields.map(f => [f.name, state[f.id]?.value])),
  //   }
  // }

  function validateSync(id: string, value: any, field: any): string | null {
    const entries = compiled.get(id)
    if (!entries) return null
    for (const entry of entries) {
      const v = registry.get(entry.name)
      if (!v?.validate) continue
      const normalized = v.normalize ? v.normalize(value) : value
      const key        = v.validate(buildCtx(id, normalized, field, entry.params))
      if (key) return resolveMessage(key, entry.params, labelMap)
    }
    return null
  }

  function scheduleAsync(id: string, value: any, field: any): void {
    const entries = compiled.get(id)?.filter(e => e.hasAsync)
    if (!entries?.length) return
    const wait = Math.max(...entries.map(e => registry.get(e.name)?.debounce ?? 0))
    clearTimeout(debounceTimers.get(id))
    state[id].pending = true
    debounceTimers.set(id, setTimeout(async () => {
      for (const entry of entries) {
        const v   = registry.get(entry.name)!
        const key = await v.validateAsync!(buildCtx(id, value, field, entry.params))
        if (key) {
          state[id].error   = resolveMessage(key, entry.params, labelMap)
          state[id].pending = false
          return
        }
      }
      state[id].pending = false
    }, wait))
  }

  // called by set() — returns sync error, fires async in background
  function validate(id: string, value: any, field: any): string | null {
    const error = validateSync(id, value, field)
    if (!error) scheduleAsync(id, value, field)
    return error
  }

  // re-validate fields that reference `changedFieldName` in their params
  function revalidateDeps(changedFieldName: string, fieldsById: Map<string, any>): void {
    for (const depId of validationDeps.get(changedFieldName) ?? []) {
      if (!state[depId]?.touched) continue   // don't surface errors prematurely
      const depField = fieldsById.get(depId)!
      state[depId].error = validateSync(depId, state[depId].value, depField)
    }
  }

  // called on submit — touches all visible fields
  function validateAll(visibleFields: any[]): boolean {
    let valid = true
    for (const field of visibleFields) {
      const error = validateSync(field.id, state[field.id]?.value, field)
      state[field.id].error   = error
      state[field.id].touched = true
      if (error) valid = false
    }
    return valid
  }

  return { validate, validateAll, revalidateDeps }
}

import { useValidation } from './useValidation'

export function useEngine(data: any) {
  const { fields } = useData(data)
  const { nodes }  = useNode(fields)
  const { graph }  = useGraph(nodes)

  const state = reactive<Record<string, any>>({})

  // index for O(1) lookup in set() and revalidateDeps()
  const fieldsById = new Map(fields.map((f: any) => [f.id, f]))

  for (const field of fields) {
    const runtime: any = { name: field.name }
    for (const prop of field.$nodes) {
      const node = nodes.get(`${field.id}.${prop}`)
      if (!node) continue
      runtime[prop] = node?.default
    }
    runtime.value   ??= ''
    runtime.visible ??= true
    runtime.error     = null    // ← new
    runtime.touched   = false   // ← new
    runtime.pending   = false   // ← new (async in flight)
    state[field.id] = runtime
  }

  const { executeNode, execute } = useExecutor(nodes, state)
  const { validate, validateAll, revalidateDeps } = useValidation(fields, state)  // ← new

  const set = (value: any, id: string): void => {
    state[id].value   = value
    state[id].touched = true

    const field = fieldsById.get(id)!

    // sync gate — only advance graph if valid
    const error = validate(id, value, field)
    state[id].error = error
    if (error) return

    execute(graph[state[id].name])

    // re-validate any sibling that depends on this field's value
    revalidateDeps(state[id].name, fieldsById)   // ← new
  }

  const validateForm = (): boolean => {
    const visible = fields.filter((f: any) => state[f.id]?.visible)
    return validateAll(visible)
  }

  return {
    fields,
    state,
    runNodeRequests,
    populateState,
    set,
    validateForm,   // ← expose for submit handler
  }
}

// numeric relational
{ name: "maxPrice",  validators: [["required"], ["gt",  { field: "$minPrice" }]] },
{ name: "minPrice",  validators: [["required"], ["lt",  { field: "$maxPrice" }]] },

// date from/to
{ name: "checkIn",   validators: [["required"], ["dateMin", { date: "today" }]] },
{ name: "checkOut",  validators: [["required"], ["dateAfter", { field: "$checkIn" }]] },

// cross-field
{ name: "password",  validators: [["required"], ["length", { min: 8 }]] },
{ name: "confirm",   validators: [["required"], ["sameAs", { field: "password" }]] },

// conditional
{ name: "company",   validators: [["requiredIf", { field: "isCompany", equals: true }]] },

// async
{ name: "username",  validators: [["required"], ["unique", { api: "/api/check-username" }]] },