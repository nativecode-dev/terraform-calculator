import { PlanResource } from './PlanResource'

export interface PlanOutputs {
  root_module: {
    resources: PlanResource[]
  }
  private_ip: {
    sensitive: boolean
    value: string
  }
}
