import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  uuid, 
  text, 
  integer, 
  timestamp, 
  boolean, 
  numeric, 
  pgEnum,
  uniqueIndex,
  index,
  jsonb
} from 'drizzle-orm/pg-core';

// --- ENUMS (Type Safety no Banco) ---
export const roleEnum = pgEnum('role', ['USER', 'ADMIN', 'AFFILIATE']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']);
export const ledgerTypeEnum = pgEnum('ledger_type', ['CREDIT', 'DEBIT']);
export const withdrawalStatusEnum = pgEnum('withdrawal_status', ['PENDING_REVIEW', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED']);
export const riskLevelEnum = pgEnum('risk_level', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

// --- CORE TABLES ---

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: roleEnum('role').default('USER').notNull(),
  riskLevel: riskLevelEnum('risk_level').default('LOW').notNull(),
  isBanned: boolean('is_banned').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('email_idx').on(table.email),
}));

export const wallets = pgTable('wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  address: text('address').notNull(), // Normalizado lowercase na aplicação
  chain: text('chain').default('POLYGON').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  label: text('label'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  addressIdx: uniqueIndex('wallet_address_idx').on(table.address),
  userWalletsIdx: index('user_wallets_idx').on(table.userId),
}));

// --- CATALOG & COMMERCE ---

export const products = pgTable('nft_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  // Numeric(20, 2) para Fiat/USDT. Evita erros de ponto flutuante.
  priceUsdt: numeric('price_usdt', { precision: 20, scale: 2 }).notNull(),
  bonusVaultCoins: integer('bonus_vault_coins').notNull(),
  imageUrl: text('image_url').notNull(),
  tier: text('tier').notNull(),
  stock: integer('stock').notNull().default(0),
  isHot: boolean('is_hot').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  totalAmountUsdt: numeric('total_amount_usdt', { precision: 20, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  items: jsonb('items').notNull(), // Snapshot dos itens comprados
  txHash: text('tx_hash'), // Hash da transação de pagamento na blockchain
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userOrdersIdx: index('user_orders_idx').on(table.userId),
  txHashIdx: index('orders_tx_hash_idx').on(table.txHash),
}));

// --- FINANCIAL LEDGERS (IMMUTABLE) ---

// VaultCoins: Inteiro (sem casas decimais, ou casas fixas tratadas como int)
export const vaultCoinLedger = pgTable('vaultcoin_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: ledgerTypeEnum('type').notNull(),
  source: text('source').notNull(), // NFT_PURCHASE, GAME_WIN, etc.
  amount: integer('amount').notNull(), // Sempre positivo no valor absoluto
  description: text('description').notNull(),
  referenceId: text('reference_id'), // ID do pedido ou ID da sessão de jogo
  createdAt: timestamp('created_at').defaultNow().notNull(),
  // SEM UPDATED_AT: Ledger deve ser imutável
}, (table) => ({
  userLedgerIdx: index('vc_ledger_user_idx').on(table.userId),
  refIdx: index('vc_ledger_ref_idx').on(table.referenceId),
}));

// Prize Ledger (USDT): Numeric
export const prizeLedger = pgTable('prize_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: ledgerTypeEnum('type').notNull(),
  source: text('source').notNull(),
  amount: numeric('amount', { precision: 20, scale: 6 }).notNull(), // 6 casas para USDT
  status: text('status').default('AVAILABLE').notNull(), // LOCKED, AVAILABLE, PAID
  unlockDate: timestamp('unlock_date'),
  referenceId: text('reference_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  prizeUserIdx: index('prize_ledger_user_idx').on(table.userId),
}));

export const withdrawalRequests = pgTable('withdrawal_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  amount: numeric('amount', { precision: 20, scale: 6 }).notNull(),
  walletAddress: text('wallet_address').notNull(),
  network: text('network').default('POLYGON').notNull(),
  status: withdrawalStatusEnum('status').default('PENDING_REVIEW').notNull(),
  txHash: text('tx_hash'), // Hash do payout
  riskScore: integer('risk_score').default(0),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
});

// --- INFRASTRUCTURE & SECURITY ---

export const auditLog = pgTable('audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorId: text('actor_id').notNull(), // Pode ser user_id ou 'SYSTEM'
  action: text('action').notNull(),
  entity: text('entity').notNull(), // Tabela afetada
  entityId: text('entity_id').notNull(),
  metadata: jsonb('metadata'), // Dados antes/depois
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Controle de Idempotência para Blockchain
export const chainEvents = pgTable('chain_event_processed', {
  id: uuid('id').defaultRandom().primaryKey(),
  chainId: integer('chain_id').notNull(),
  txHash: text('tx_hash').notNull(),
  logIndex: integer('log_index').notNull(), // Posição do evento no bloco
  eventType: text('event_type').notNull(),
  processedAt: timestamp('processed_at').defaultNow().notNull(),
}, (table) => ({
  // Constraint única composta: Garante que o mesmo evento nunca rode 2x
  uniqueEvent: uniqueIndex('unique_chain_event').on(table.chainId, table.txHash, table.logIndex),
}));

// --- RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  orders: many(orders),
  vaultCoinTransactions: many(vaultCoinLedger),
  prizeTransactions: many(prizeLedger),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));