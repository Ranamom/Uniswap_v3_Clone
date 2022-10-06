import React, {useState, useEffect, useContext} from 'react'
import { GearFill } from 'react-bootstrap-icons'
import { getWethContract, getUniContract, getPrice, runSwap, address0, address1 } from '../AlphaRouterService'
import { ethers } from 'ethers';
import Config from './Config';
import CurrencyField from './CurrencyField';
import BeatLoader from "react-spinners/BeatLoader";
import userContext from './context/userContext';

const Body = () => {
    const context = useContext(userContext)
    const {
        onClickConnector,
        account,
        disconnectWallet,
        signer,
        provdier,
        ethersProvider
    } = context
    const [slippageAmount, setSlippageAmount] = useState(2)
    const [deadlineMinutes, setDeadlineMinutes] = useState(10)
    const [showModal, setShowModal] = useState(undefined)
    const [inputAmount, setInputAmount] = useState(undefined)
    const [outputAmount, setOutputAmount] = useState(undefined)
    const [transaction, setTransaction] = useState(undefined)
    const [loading, setLoading] = useState(undefined)
    const [ratio, setRatio] = useState(undefined)
    const [wethAmount, setWethAmount] = useState(undefined)
    const [uniAmount, setUniAmount] = useState(undefined)

    
    const getSwapPrice = (inputAmount) => {
        setLoading(true)
        setInputAmount(inputAmount)
    
        const swap = getPrice(
          inputAmount,
          slippageAmount,
          Math.floor(Date.now() / 1000 + (deadlineMinutes * 60)),
          account
        ).then(data => {
          setTransaction(data[0])
          setOutputAmount(data[1])
          setRatio(data[2])
          setLoading(false)
        })

        swap()
      }

    return (
        <div className="appBody">
            <div className="swapContainer">
                <div className="swapHeader">
                    <span className="swapText">Swap</span>
                    <span className="gearContainer" onClick={() => setShowModal(true)}>
                        <GearFill />
                    </span>
                    {showModal && (
                        <Config
                            onClose={() => setShowModal(false)}
                            setDeadlineMinutes={setDeadlineMinutes}
                            deadlineMinutes={deadlineMinutes}
                            setSlippageAmount={setSlippageAmount}
                            slippageAmount={slippageAmount} />
                    )}
                </div>

                <div className="swapBody">
                    <CurrencyField
                        field="input"
                        tokenName="WETH"
                        getSwapPrice={getSwapPrice}
                        signer={signer}
                        balance={wethAmount} />
                    <CurrencyField
                        field="output"
                        tokenName="UNI"
                        value={outputAmount}
                        signer={signer}
                        balance={uniAmount}
                        spinner={BeatLoader}
                        loading={loading} />
                </div>

                <div className="ratioContainer">
                    {ratio && (
                        <>
                            {`1 UNI = ${ratio} WETH`}
                        </>
                    )}
                </div>

                {/* Swap Button */}
                <div className="swapButtonContainer">
                    {account ? (
                        <div
                            onClick={() => runSwap(transaction, signer)}
                            className="swapButton"
                        >
                            Swap
                        </div>
                    ) : (
                        <div
                            onClick={() => onClickConnector()}
                            className="swapButton"
                        >
                            Connect Wallet
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Body