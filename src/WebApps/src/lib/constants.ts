// No authentication yet — the basket is keyed by a single demo user.
// Mirrors the default user used by the reference WebApps project.
export const DEFAULT_USER_NAME = 'swn'

// Ordering seeds a fixed set of customers; the checkout customerId must match one
// of them or the order's CustomerId FK constraint fails. Maps to the seeded "john"
// customer (Ordering.Infrastructure InitialData).
export const DEFAULT_CUSTOMER_ID = '189dc8dc-990f-48e0-a37b-e6f2b60b9d7d'
