import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import CandlestickChart from '../CandlestickChart';

const CoinOverview = async () => {
try {
  // Fetch coin details and OHLC data in parallel
  // OHLC means Open, High, Low, Close data for candlestick charts
  // *using promise.all for concurrent fetching
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('/coins/bitcoin', {
        dex_pair_format: 'symbol',
      }),
      fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        // interval: 'hourly',
        precision: 'full',
      }),
    ]);

  return (
    <div id="coin-overview">
        <CandlestickChart data={coinOHLCData} coinId="bitcoin">
          <div className="header pt-2">
            <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
            <div className="info">
              <p>
                {coin.name} / {coin.symbol.toUpperCase()}
              </p>
              <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
            </div>
          </div>
        </CandlestickChart>
      </div>
    );

}
  catch (error) {
    console.error('Failed to fetch coin data:', error);
    return <div> Failed to load coin data. </div>
}
};
export default CoinOverview;
