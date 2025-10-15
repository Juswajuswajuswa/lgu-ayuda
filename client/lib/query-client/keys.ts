/**
 * Centralized query keys for TanStack Query
 * Following the pattern: [domain, action, ...params]
 */

export const queryKeys = {
  // Authentication
  auth: {
    admin: ["auth", "admin"] as const,
    currentUser: ["auth", "current-user"] as const,
  },

  // Users/Staff
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },

  // Goods
  goods: {
    all: ["goods"] as const,
    detail: (id: string) => ["goods", "detail", id] as const,
  },

  // Barangay
  barangay: {
    all: ["barangays"] as const,
    detail: (id: string) => ["barangays", "detail", id] as const,
  },

  // Beneficiaries
  beneficiary: {
    all: ["beneficiaries"] as const,
    detail: (id: string) => ["beneficiaries", "detail", id] as const,
  },

  // Ayuda
  ayuda: {
    all: ["ayuda"] as const,
    detail: (id: string) => ["ayuda", "detail", id] as const,
  },

  // Applications
  application: {
    all: ["applications"] as const,
    detail: (id: string) => ["applications", "detail", id] as const,
  },

  // Distribution
  distribution: {
    all: ["distributions"] as const,
    detail: (id: string) => ["distributions", "detail", id] as const,
  },

  // Projects
  project: {
    all: ["projects"] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
  },
} as const;
