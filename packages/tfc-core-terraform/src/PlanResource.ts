export interface PlanResource {
  address: string
  mode: string
  type: string
  name: string
  index: number
  provider_name: string
  schema_version: number
  values: { [key: string]: any }
  child_modules: PlanResource[]
}
