import { 
  ICatalogRepository, 
  IOrdersRepository, 
  IVaultCoinsRepository, 
  IRewardsRepository 
} from './domain/ports';
import { 
  InMemoryCatalogRepo, 
  InMemoryOrdersRepo, 
  InMemoryVaultCoinsRepo, 
  InMemoryRewardsRepo 
} from './infrastructure/repositories/in-memory';
import { 
  DrizzleCatalogRepo, 
  DrizzleOrdersRepo, 
  DrizzleVaultCoinsRepo, 
  DrizzleRewardsRepo 
} from './infrastructure/repositories/drizzle';

// Configuração
const USE_REAL_DB = process.env.DB_TYPE === 'postgres';

export class RepositoryFactory {
  private static _catalog: ICatalogRepository;
  private static _orders: IOrdersRepository;
  private static _vaultCoins: IVaultCoinsRepository;
  private static _rewards: IRewardsRepository;

  static get catalog(): ICatalogRepository {
    if (!this._catalog) {
      this._catalog = USE_REAL_DB ? new DrizzleCatalogRepo() : new InMemoryCatalogRepo();
      console.log(`[Factory] CatalogRepo initialized using: ${USE_REAL_DB ? 'Drizzle/Postgres' : 'In-Memory'}`);
    }
    return this._catalog;
  }

  static get orders(): IOrdersRepository {
    if (!this._orders) {
      this._orders = USE_REAL_DB ? new DrizzleOrdersRepo() : new InMemoryOrdersRepo();
    }
    return this._orders;
  }

  static get vaultCoins(): IVaultCoinsRepository {
    if (!this._vaultCoins) {
      this._vaultCoins = USE_REAL_DB ? new DrizzleVaultCoinsRepo() : new InMemoryVaultCoinsRepo();
    }
    return this._vaultCoins;
  }

  static get rewards(): IRewardsRepository {
    if (!this._rewards) {
      this._rewards = USE_REAL_DB ? new DrizzleRewardsRepo() : new InMemoryRewardsRepo();
    }
    return this._rewards;
  }
}