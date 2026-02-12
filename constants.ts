
import { AssetType } from './types';
import type { MarketAsset } from './types';

export const ASSETS: MarketAsset[] = [
  // CRYPTO
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    price: 64250.80,
    change24h: 2.45,
    type: AssetType.CRYPTO,
    volume24h: '35B',
    description: 'A maior criptomoeda do mundo, altamente volátil e ideal para day trade.',
    delay: 'Real-time'
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum',
    price: 3450.20,
    change24h: 1.80,
    type: AssetType.CRYPTO,
    volume24h: '18B',
    description: 'Plataforma de contratos inteligentes e segunda maior cripto.',
    delay: 'Real-time'
  },
  {
    symbol: 'SOLUSD',
    name: 'Solana',
    price: 145.60,
    change24h: -3.20,
    type: AssetType.CRYPTO,
    volume24h: '5B',
    description: 'Blockchain de alta performance com alta volatilidade intraday.',
    delay: 'Real-time'
  },
  // COMMODITIES
  {
    symbol: 'XAUUSD',
    name: 'Gold / USD',
    price: 2350.40,
    change24h: 0.75,
    type: AssetType.COMMODITY,
    volume24h: '150B',
    description: 'Ativo de segurança global. Usado para hedge e especulação.',
    delay: 'Real-time'
  },
  {
    symbol: 'WTI_OIL',
    name: 'Crude Oil WTI',
    price: 78.45,
    change24h: -1.25,
    type: AssetType.COMMODITY,
    volume24h: '45B',
    description: 'Petróleo bruto, sensível a tensões geopolíticas e dados de estoque.',
    delay: 'Real-time'
  },
  // FUNDS / ETFS (Proxy para Fundos de Investimentos)
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    price: 512.45,
    change24h: 0.85,
    type: AssetType.FUND,
    volume24h: '80B',
    description: 'Fundo que replica o índice S&P 500. Liquidez extrema.',
    delay: 'Real-time'
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    price: 435.20,
    change24h: 1.15,
    type: AssetType.FUND,
    volume24h: '65B',
    description: 'Fundo focado em tecnologia (NASDAQ-100). Ideal para scalping.',
    delay: 'Real-time'
  },
  {
    symbol: 'IVVB11',
    name: 'iShares S&P 500 (B3)',
    price: 285.40,
    change24h: 0.95,
    type: AssetType.FUND,
    volume24h: '1.2B',
    description: 'Fundo de índice brasileiro que replica o S&P 500.',
    delay: '15 min'
  },
  // CURRENCIES
  {
    symbol: 'USDBRL',
    name: 'USD / BRL',
    price: 5.12,
    change24h: 0.25,
    type: AssetType.CURRENCY,
    volume24h: '1.2T',
    description: 'Dólar vs Real. Paridade principal do mercado brasileiro.',
    delay: 'Real-time'
  },
  {
    symbol: 'EURUSD',
    name: 'EUR / USD',
    price: 1.08,
    change24h: -0.15,
    type: AssetType.CURRENCY,
    volume24h: '2.5T',
    description: 'O par de moedas mais negociado do mundo.',
    delay: 'Real-time'
  },
  // INDICES
  {
    symbol: 'IBOV',
    name: 'Ibovespa',
    price: 128450,
    change24h: 1.15,
    type: AssetType.INDEX,
    volume24h: '25B',
    description: 'Principal índice de ações da bolsa brasileira B3.',
    delay: '15 min'
  }
];

export const generateMockHistory = (basePrice: number, count: number = 24) => {
  const history = [];
  let current = basePrice;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * (basePrice * 0.012);
    current += change;
    history.push({
      time: `${i}:00`,
      price: current,
      volume: Math.floor(Math.random() * 1000)
    });
  }
  return history;
};
