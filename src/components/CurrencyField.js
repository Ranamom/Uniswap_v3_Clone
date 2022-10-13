import React, {useContext, useEffect, useState} from 'react'
import userContext from './context/userContext'

const CurrencyField = props => {
  const context = useContext(userContext)
  const {
    account,
    wethContract,
    connected,
    quoterContract
  } = context

  const [balance, setBalance] = useState(null)
  const [inp, setInp] = useState(null)

  const getPrice = (value) => {
    props.getSwapPrice(value)
  }

  useEffect(() => {
    const gettingIt = async () => {
      const bal = await props.contract.balanceOf(account)
      setBalance(String(bal / 10 ** 18))
    }

    if (account && props.contract) {
      gettingIt()
    }

  }, [account])
  
  return (
    <div className="row currencyInput">
      <div className="col-md-6 numberContainer">
        {props.loading ? (
          <div className="spinnerContainer">
            <props.spinner />
          </div>
        ) : (
          <input
            type={"number"}
            className="currencyInputField"
            placeholder="0.0"
            value={props.value}
            onBlur = {e => (props.field === 'input' ? getPrice(e.target.value) : null)}
          />
        )}
      </div>
      <div className="col-md-6 tokenContainer">
        <span className="tokenName">{props.tokenName}</span>
        <div className="balanceContainer">
          <span className="balanceAmount">Balance: {balance && connected ? balance.slice(0,5) : ""}</span>
        </div>
      </div>
    </div>
  )
}

export default CurrencyField