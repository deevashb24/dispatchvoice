import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';

export const tradeCategoryEnum = pgEnum('trade_category', [
  'PLUMBING',
  'HVAC',
  'ELECTRICAL',
  'ROOFING',
  'TOWING',
  'LOCKSMITH',
]);

export const urgencyTierEnum = pgEnum('urgency_tier', [
  'EMERGENCY_DISPATCH',
  'NEXT_DAY',
  'STANDARD_INQUIRY',
]);

export const callOutcomeEnum = pgEnum('call_outcome', [
  'BOOKED',
  'DEPOSIT_PENDING',
  'TRANSFERRED_TO_HUMAN',
  'INFO_PROVIDED',
  'ABANDONED',
]);

export const crmProviderEnum = pgEnum('crm_provider', [
  'JOBBER',
  'SERVICETITAN',
  'HOUSECALL_PRO',
  'GOOGLE_CALENDAR',
]);

export const depositStatusEnum = pgEnum('deposit_status', [
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
]);

export const tradeContractors = pgTable('trade_contractors', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessName: varchar('business_name', { length: 150 }).notNull(),
  tradeCategory: tradeCategoryEnum('trade_category').notNull(),
  forwardingPhone: varchar('forwarding_phone', { length: 20 }).notNull(),
  crmProvider: crmProviderEnum('crm_provider').default('JOBBER').notNull(),
  crmAccessToken: text('crm_access_token'),
  emergencyDiagnosticFee: numeric('emergency_diagnostic_fee', { precision: 8, scale: 2 }).default('89.00').notNull(),
  voiceAgentName: varchar('voice_agent_name', { length: 50 }).default('Sarah (AI Dispatcher)').notNull(),
  voiceModelId: varchar('voice_model_id', { length: 50 }).default('sonic-english-trade-v1').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const onCallTechnicians = pgTable('on_call_technicians', {
  id: uuid('id').defaultRandom().primaryKey(),
  contractorId: uuid('contractor_id')
    .references(() => tradeContractors.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  tradeCategory: tradeCategoryEnum('trade_category').notNull(),
  zoneArea: varchar('zone_area', { length: 100 }).notNull(),
  isOnDuty: boolean('is_on_duty').default(true).notNull(),
  priorityOrder: integer('priority_order').default(1).notNull(),
  activeJobCount: integer('active_job_count').default(0).notNull(),
  estimatedEtaMinutes: integer('estimated_eta_minutes').default(15).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const voiceCalls = pgTable(
  'voice_calls',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contractorId: uuid('contractor_id')
      .references(() => tradeContractors.id, { onDelete: 'cascade' })
      .notNull(),
    technicianId: uuid('technician_id').references(() => onCallTechnicians.id, { onDelete: 'set null' }),
    callerPhone: varchar('caller_phone', { length: 20 }).notNull(),
    callerName: varchar('caller_name', { length: 100 }),
    callerAddress: text('caller_address'),
    callDurationSeconds: integer('call_duration_seconds').default(0).notNull(),
    turnLatencyMs: integer('turn_latency_ms').default(365).notNull(),
    urgency: urgencyTierEnum('urgency').default('STANDARD_INQUIRY').notNull(),
    outcome: callOutcomeEnum('outcome').default('INFO_PROVIDED').notNull(),
    audioRecordingUrl: varchar('audio_recording_url', { length: 512 }),
    fullTranscript: text('full_transcript').notNull(),
    issueSummary: text('issue_summary'),
    depositPaymentLink: varchar('deposit_payment_link', { length: 512 }),
    isDepositPaid: boolean('is_deposit_paid').default(false).notNull(),
    externalCrmJobId: varchar('external_crm_job_id', { length: 100 }),
    customerSentimentScore: numeric('customer_sentiment_score', { precision: 3, scale: 2 }).default('0.85').notNull(),
    interruptCount: integer('interrupt_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    contractorIdx: index('idx_calls_contractor').on(table.contractorId, table.createdAt),
    urgencyIdx: index('idx_calls_urgency').on(table.urgency),
  })
);

export const telephonyEvents = pgTable(
  'telephony_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    callId: uuid('call_id')
      .references(() => voiceCalls.id, { onDelete: 'cascade' })
      .notNull(),
    eventType: varchar('event_type', { length: 50 }).notNull(),
    speaker: varchar('speaker', { length: 20 }).notNull(),
    messageContent: text('message_content').notNull(),
    latencyMs: integer('latency_ms').default(0).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    callIdx: index('idx_events_call').on(table.callId, table.timestamp),
  })
);

export const depositTransactions = pgTable('deposit_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  callId: uuid('call_id')
    .references(() => voiceCalls.id, { onDelete: 'cascade' })
    .notNull(),
  stripeSessionId: varchar('stripe_session_id', { length: 100 }).notNull().unique(),
  amount: numeric('amount', { precision: 8, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  status: depositStatusEnum('status').default('PENDING').notNull(),
  receiptUrl: varchar('receipt_url', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
