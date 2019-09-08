import { PlanState } from './PlanState'
import { PlanConfig } from './PlanConfig'
import { PlanValues } from './PlanValues'
import { PlanVariables } from './PlanVariables'
import { PlanOutputChanges } from './PlanOutputChanges'
import { PlanResourceChange } from './PlanResourceChange'

export interface Plan {
  config: PlanConfig
  format_version: string
  output_changes: PlanOutputChanges
  planned_values: PlanValues
  prior_state: PlanState
  proposed_unknown: PlanValues
  resource_changes: PlanResourceChange[]
  variables: PlanVariables
}
