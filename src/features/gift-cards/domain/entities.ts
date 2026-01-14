export interface GiftBoxTier {
  id: string;
  price: number;
  name: string;
  guaranteedMinMultiplier: number; // Ex: 1.1 means 110% total return
}

export interface Brand {
  id: string;
  name: string;
  logoIcon: string;
}

export interface GiftReward {
  giftCardValue: number;
  coinValue: number;
  brand: string;
  totalValue: number;
}

export const SUPPORTED_BRANDS = [
  "Amazon", "Apple", "Ebay", "Rappi", "Steam", "Spotify", 
  "Youtube", "Xbox", "Aliexpress", "Uber", "Airbnb", 
  "Free Fire", "Roblox", "Netflix", "Shopee", "Zé Delivery", 
  "Centauro", "Disney"
];

export const GIFT_TIERS: GiftBoxTier[] = [
  { id: 'gb-1', price: 5.00, name: 'Starter Pack', guaranteedMinMultiplier: 1.1 },
  { id: 'gb-2', price: 10.00, name: 'Basic Bundle', guaranteedMinMultiplier: 1.15 },
  { id: 'gb-3', price: 25.00, name: 'Standard Kit', guaranteedMinMultiplier: 1.2 },
  { id: 'gb-4', price: 50.00, name: 'Advanced Box', guaranteedMinMultiplier: 1.25 },
  { id: 'gb-5', price: 75.00, name: 'Premium Case', guaranteedMinMultiplier: 1.3 },
  { id: 'gb-6', price: 100.00, name: 'Elite Vault', guaranteedMinMultiplier: 1.35 },
  { id: 'gb-7', price: 150.00, name: 'Pro Stash', guaranteedMinMultiplier: 1.4 },
  { id: 'gb-8', price: 200.00, name: 'Master Chest', guaranteedMinMultiplier: 1.45 },
  { id: 'gb-9', price: 300.00, name: 'Ultra Container', guaranteedMinMultiplier: 1.5 },
  { id: 'gb-10', price: 500.00, name: 'Legendary Hoard', guaranteedMinMultiplier: 1.6 },
];