import React from 'react'
import {Chip} from 'react-toolbox/lib/chip'

export default ({stocks, remove}) =>
  <div>
    {stocks.map(stock =>
      <Chip
        key={stock.symbol}
        deletable={true}
        onDeleteClick={() => remove(stock.symbol)}
      >
        <span>{`${stock.symbol} - ${stock.name}`}</span>
      </Chip>
    )}
  </div>
