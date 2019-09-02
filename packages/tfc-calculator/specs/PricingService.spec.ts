import 'mocha'

import { PricingService } from '../src/PricingService'

describe('when using the pricing service', () => {
  const ec2 = 'AmazonEC2'

  describe(`to get pricing for ${ec2} service code`, () => {
    it('should get product pricing', () => {
      const sut = new PricingService()
    })
  })
})
