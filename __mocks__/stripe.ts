const Stripe = jest.fn().mockImplementation(() => ({
  accounts: {
    create: jest.fn().mockResolvedValue({ id: "stripe-organization-test-id" }),
  },
  customers: {
    create: jest.fn().mockResolvedValue({ id: "stripe-customer-id" }),
    update: jest.fn(),
  },
  checkout: {
    sessions: {
      create: jest
        .fn()
        .mockImplementation((args: { success_url: string }) =>
          Promise.resolve({ url: args.success_url }),
        ),
    },
  },
  prices: {
    create: jest.fn().mockResolvedValue({ id: "stripe-price-id" }),
  },
  products: {
    create: jest.fn().mockResolvedValue({ id: "stripe-product-id" }),
  },
  subscriptionItems: {
    createUsageRecord: jest.fn().mockResolvedValue(undefined),
  },
  subscriptions: {
    retrieve: jest.fn().mockResolvedValue({
      items: {
        data: [
          { id: "subscription-id", price: { recurring: { interval: null } } },
        ],
      },
    }),
  },
  taxRates: {
    create: jest.fn().mockResolvedValue({ id: "stripe-taxrate-id" }),
    update: jest.fn(),
  },
}));

export default Stripe;
export const stripe = jest.fn(() => new Stripe());
