import { 
  MinesStartResponse, 
  MinesRevealResponse, 
  MinesCashoutResponse, 
  WheelSpinResponse,
  BoxPurchaseResponse
} from '@core/domain/api-contracts';

// Estado "Server-Side" simulado (Memória volátil para dev)
let SERVER_VAULT_COINS = 5000;
let SERVER_USDT = 1500.00;

// Estado privado do jogo (o cliente NUNCA vê isso)
interface ActiveGame {
  id: string;
  minesLocations: number[];
  wager: number;
  revealedCount: number;
  isActive: boolean;
}

let activeMinesGame: ActiveGame | null = null;

// Delay simulado de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockBackend {
  
  // --- MINES ENGINE ---
  
  static async startMines(wager: number, minesCount: number): Promise<MinesStartResponse> {
    await delay(300);
    
    if (SERVER_VAULT_COINS < wager) throw new Error("Saldo insuficiente no servidor.");
    
    SERVER_VAULT_COINS -= wager;
    
    // Geração de minas no "servidor"
    const locations: number[] = [];
    while (locations.length < minesCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!locations.includes(pos)) locations.push(pos);
    }

    activeMinesGame = {
      id: Math.random().toString(36).substring(7),
      minesLocations: locations,
      wager,
      revealedCount: 0,
      isActive: true
    };

    return {
      gameId: activeMinesGame.id,
      wager,
      balanceAfterWager: SERVER_VAULT_COINS
    };
  }

  static async revealMines(gameId: string, tileIndex: number): Promise<MinesRevealResponse> {
    await delay(200);
    
    if (!activeMinesGame || activeMinesGame.id !== gameId || !activeMinesGame.isActive) {
      throw new Error("Sessão de jogo inválida.");
    }

    const isMine = activeMinesGame.minesLocations.includes(tileIndex);
    
    // Cálculo de Multiplicador Server-Side
    // Lógica simplificada para demonstração
    const totalTiles = 25;
    const mines = activeMinesGame.minesLocations.length;
    activeMinesGame.revealedCount++;
    
    // Fórmula básica de odds
    const multiplier = 1 + (activeMinesGame.revealedCount * (mines / (totalTiles - mines)));

    if (isMine) {
      activeMinesGame.isActive = false;
      return {
        status: 'MINE',
        grid: [], // Em prod, retornaria o grid completo para mostrar onde estavam as minas
        currentMultiplier: 0,
        potentialReward: 0,
        isGameOver: true
      };
    }

    return {
      status: 'SAFE',
      grid: [], // O cliente mantém o estado visual, o server valida
      currentMultiplier: parseFloat(multiplier.toFixed(2)),
      potentialReward: Math.floor(activeMinesGame.wager * multiplier),
      isGameOver: false
    };
  }

  static async cashoutMines(gameId: string): Promise<MinesCashoutResponse> {
    await delay(300);
    if (!activeMinesGame || activeMinesGame.id !== gameId || !activeMinesGame.isActive) {
      throw new Error("Não é possível sacar.");
    }

    // Recalcula prêmio final para garantir integridade
    const totalTiles = 25;
    const mines = activeMinesGame.minesLocations.length;
    const multiplier = 1 + (activeMinesGame.revealedCount * (mines / (totalTiles - mines)));
    const payout = Math.floor(activeMinesGame.wager * multiplier);

    // Credita prêmio (simula ledger de rewards USDT)
    // Nota: No sistema real, VaultCoins -> Prêmio USDT. Aqui simplificamos retornando ao saldo.
    // Ajuste conforme regra de negócio: VaultCoins entram, USDT sai? 
    // Regra do PRD: Gasta VaultCoins, Ganha USDT (Reward).
    
    // Simulando ganho em USDT no Ledger de Prêmios
    // SERVER_USDT += (payout * 0.01); // Ex: Conversão hipotética ou valor direto
    
    // Para simplificar a UI demo, vamos devolver VaultCoins com lucro por enquanto
    SERVER_VAULT_COINS += payout;
    
    activeMinesGame.isActive = false;

    return {
      totalPayout: payout,
      newBalance: SERVER_VAULT_COINS
    };
  }

  // --- WHEEL ENGINE ---

  static async spinWheel(): Promise<WheelSpinResponse> {
    await delay(800);
    
    // Configuração Server-Side das probabilidades
    const SECTORS = [
      { label: '50 VC', value: 50, weight: 30 },
      { label: '10 VC', value: 10, weight: 40 },
      { label: '250 VC', value: 250, weight: 10 },
      { label: '5 VC', value: 5, weight: 50 },
      { label: '100 VC', value: 100, weight: 20 },
      { label: 'JACKPOT', value: 2500, weight: 1 },
      { label: '25 VC', value: 25, weight: 30 },
      { label: '500 VC', value: 500, weight: 5 },
    ];

    const totalWeight = SECTORS.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < SECTORS.length; i++) {
      if (random < SECTORS[i].weight) {
        selectedIndex = i;
        break;
      }
      random -= SECTORS[i].weight;
    }

    const result = SECTORS[selectedIndex];
    SERVER_VAULT_COINS += result.value;

    return {
      winningIndex: selectedIndex,
      rewardLabel: result.label,
      rewardValue: result.value,
      isJackpot: result.label === 'JACKPOT',
      newBalance: SERVER_VAULT_COINS
    };
  }

  // --- MARKETPLACE ---
  static async purchaseBox(_boxId: string, price: number): Promise<BoxPurchaseResponse> {
    await delay(1000);
    
    if (SERVER_USDT < price) throw new Error("Saldo USDT insuficiente.");
    SERVER_USDT -= price; // Deduz do saldo real

    // Lógica de Geração de Loot (RNG no servidor)
    const tiers = ['Common', 'Rare', 'Epic', 'Legendary'];
    const randomTier = tiers[Math.floor(Math.random() * tiers.length)]; // Simplificado
    const value = price * (1 + Math.random()); // Garante valor > preço (regra de negócio)

    return {
      reward: {
        id: Math.random().toString(36),
        name: `${randomTier} Artifact`,
        value: parseFloat(value.toFixed(2)),
        rarity: randomTier
      },
      newBalance: SERVER_USDT
    };
  }
  
  // Sync inicial
  static async getBalances() {
    await delay(200);
    return {
      vaultCoins: SERVER_VAULT_COINS,
      usdt: SERVER_USDT
    };
  }
}