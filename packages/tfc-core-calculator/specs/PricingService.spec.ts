import 'mocha'

import { fs } from '@nofrills/fs'

import { ARTIFACTS_ROOT } from './dirs'
import { PricingService } from '../src/PricingService'

describe('when using the pricing service', () => {
  const ec2 = 'AmazonEC2'
  const ec2filename = fs.join(ARTIFACTS_ROOT, `pricing-${ec2}.json`)

  describe(`to get pricing for ${ec2} service code`, () => {
    it('should get product pricing', async () => {
      const sut = new PricingService()
    })
  })
})
