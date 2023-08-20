const MIN_PRICE = 20;
const MAX_PRICE = 9999;
const MARKET_COMMISION = 0.3;

export default class Market {
  turnover = {};
  baseResource = null;
  balance = {};

  constructor(baseResource, balance) {
    this.baseResource = baseResource;
    this.balance = balance;
  }

  getCost(resource, amount, direction = 'buy') {
    const multiply = direction === 'buy' ? -1 : 1;
    const resourceTurnover = this.turnover[resource.name] || { buy: 0, sell: 0 };
    const difference = Math.round((resourceTurnover.buy - resourceTurnover.sell * 3) / 100);
    const fairPrice = Math.min(Math.max(resource.price + difference, MIN_PRICE), MAX_PRICE);
    const cost = Math.floor(fairPrice - multiply * fairPrice * MARKET_COMMISION);

    return cost * (amount / 100);
  }

  tradeResource(resource, amount, direction = 'buy') {
    const multiply = direction === 'buy' ? -1 : 1;
    const baseResourceBalance = this.balance[this.baseResource.name] || 0;
    const resourceBalance = this.balance[resource.name] || 0;
    const resourceTurnover = this.turnover[resource.name] || { buy: 0, sell: 0 };
    const cost = this.getCost(resource, amount, direction);
    const tradePrice = (amount / 100) * cost;

    if (baseResourceBalance < cost && direction === 'buy') {
      throw new Error('Not enough gold');
    } else if (resourceBalance < tradePrice && direction === 'sell') {
      throw new Error('Not enough resource');
    }
    console.info(tradePrice, cost, amount)
    this.balance[this.baseResource.name] = baseResourceBalance + multiply * tradePrice;
    this.balance[resource.name] = (this.balance[resource.name] || 0) - multiply * amount;
    if (direction === 'buy') {
      resourceTurnover.buy += tradePrice;
    } else {
      resourceTurnover.sell += tradePrice;
    }
    this.turnover[resource.name] = resourceTurnover;
  }

  buyResource(resource, amount) {
    return this.tradeResource(resource, amount, 'buy');
  }

  sellResource(resource, amount) {
    return this.tradeResource(resource, amount, 'sell');
  }
}
