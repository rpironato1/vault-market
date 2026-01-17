import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { 
  products, 
  orders, 
  vaultCoinLedger, 
  prizeLedger, 
  withdrawalRequests, 
  users 
} from './schema';

// --- CAMADA B: SCHEMAS DE PERSISTÊNCIA (INTERNOS) ---
// Estes schemas espelham 1:1 o banco de dados.
// Use APENAS dentro dos Repositórios ou Serviços do Backend.
// NUNCA exporte isso para o Frontend (acoplamento forte).

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertVaultCoinTransactionSchema = createInsertSchema(vaultCoinLedger);
export const insertWithdrawalSchema = createInsertSchema(withdrawalRequests);