import { PlanChange } from './PlanChange'

export interface PlanResourceChange {
  address: string
  module_address: string
  mode: string
  type: string
  name: string
  index: number
  deposed: string
  change: PlanChange
}
