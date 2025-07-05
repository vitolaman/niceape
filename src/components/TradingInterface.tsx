import React, { useState } from 'react';
import { Button } from './ui/button';
import { useWallet } from '@jup-ag/wallet-adapter';

interface TradingInterfaceProps {
  campaignSymbol: string;
  campaignName: string;
  currentPrice: number;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({
  campaignSymbol,
  campaignName,
  currentPrice,
}) => {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Here you would integrate with your trading smart contract
    console.log(`${tradeType} ${amount} ${campaignSymbol} tokens`);
    alert(`${tradeType} order placed! (Feature coming soon)`);
  };

  const estimatedCost = parseFloat(amount || '0') * currentPrice;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Trade {campaignSymbol} - {campaignName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Current Price: ${currentPrice.toFixed(4)}
        </p>
      </div>

      <form onSubmit={handleTrade} className="space-y-4">
        {/* Trade Type Selector */}
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            type="button"
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              tradeType === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              tradeType === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount ({campaignSymbol})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
          />
        </div>

        {/* Estimated Cost */}
        {amount && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors duration-300">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Estimated {tradeType === 'buy' ? 'Cost' : 'Receive'}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${estimatedCost.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Trading Fee Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 transition-colors duration-300">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 Trading fees from this transaction will be donated to {campaignName}
          </p>
        </div>

        {/* Trade Button */}
        <Button
          type="submit"
          className={`w-full font-medium py-3 rounded-lg text-white ${
            tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
          disabled={!publicKey}
        >
          {!publicKey
            ? 'Connect Wallet to Trade'
            : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${campaignSymbol}`}
        </Button>
      </form>
    </div>
  );
};

export default TradingInterface;
