import { Pricing } from 'aws-sdk'
import { promisify } from 'typed-promisify'

export class PricingService {
  private readonly pricing: Pricing

  constructor() {
    const options: Pricing.ClientConfiguration = {
      region: 'us-east-1',
    }
    this.pricing = new Pricing(options)
  }

  async getPricing(serviceCode: string): Promise<string[]> {
    const method = promisify<Pricing.GetProductsRequest, Pricing.GetProductsResponse>(
      this.pricing.getProducts,
      this.pricing,
    )

    const request: Pricing.GetProductsRequest = {
      ServiceCode: serviceCode,
    }

    const response = await method(request)
    return response.PriceList || []
  }
}
