import { pgTable, serial, text, integer, timestamp, decimal, boolean, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  priceUsdt: decimal('price_usdt', { precision: 10, scale: 2 }).notNull(),
  bonusVaultCoins: integer('bonus_vault_coins').notNull(),
  imageUrl: text('image_url').notNull(),
  tier: text('tier').notNull(), // Enum: Common, Rare...
  stock: integer('stock').notNull(),
  isHot: boolean('is_hot').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  items: jsonb('items').notNull(), // Armazenando itens como JSONB para simplificar MVP
  totalAmountUsdt: decimal('total_amount_usdt').notNull(),
  status: text('status').notNull(),
  txHash: text('tx_hash'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const vaultCoinLedger = pgTable('vault_coin_ledger', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(), // CREDIT, DEBIT
  source: text('source').notNull(),
  amount: integer('amount').notNull(),
  description: text('description'),
  referenceId: text('reference_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const withdrawals = pgTable('withdrawals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  amount: decimal('amount').notNull(),
  walletAddress: text('wallet_address').notNull(),
  network: text('network').default('POLYGON'),
  status: text('status').notNull(),
  txHash: text('tx_hash'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow(),
});