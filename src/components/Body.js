import React, {useState, useEffect, useContext} from 'react'
import { GearFill } from 'react-bootstrap-icons'
import { Token } from '@uniswap/sdk-core'
import Config from './Config'
import CurrencyField from './CurrencyField'
import BeatLoader from "react-spinners/BeatLoader"
import userContext from './context/userContext'

const Body = () => {
    const context = useContext(userContext)
    const {
        onClickConnector,
        account,
        signer,
        inputToken,
        outputToken,
        inputTokenName,
        outputTokenName,
        inputContract,
        outputContract,
        ratio,
        setRatio,
        getPrice,
        runSwap
    } = context
    const [slippageAmount, setSlippageAmount] = useState(2)
    const [deadlineMinutes, setDeadlineMinutes] = useState(10)
    const [showModal, setShowModal] = useState(undefined)
    const [inputAmount, setInputAmount] = useState(undefined)
    const [outputAmount, setOutputAmount] = useState(undefined)
    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading] = useState(undefined)

    useEffect(() => {
        
    }, [ratio])

    const getSwapPrice = async (inputAmount) => {
        if (inputAmount) {
            setLoading(true)
            setInputAmount(inputAmount) 
            
            await getPrice(
                inputAmount,
                slippageAmount, 
                Math.floor(Date.now() / 1000 + (deadlineMinutes * 60)),
                account
            ).then(res => {
                setTransaction(res[0])
                setOutputAmount(res[1])
                setRatio(res[2])
                setLoading(false)
            })
        }
        else {
            setOutputAmount(0)
        }
    }

    return (
        <div className="appBody">
            <div className="swapContainer">
                <div className="swapHeader">
                    <span className="swapText">Swap</span>
                    <span className="gearContainer" onClick={() => {
                        setShowModal(true)
                        }}>
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
                        tokenName={inputTokenName}
                        getSwapPrice={getSwapPrice}
                        signer={signer}
                        contract={inputContract} 
                        />
                    <CurrencyField   
                        field="output"
                        tokenName={outputTokenName}
                        value={outputAmount} 
                        signer={signer}
                        contract={outputContract} 
                        spinner={BeatLoader} 
                        loading={loading} />
                </div>
                <div className="ratioContainer"> 
                    {ratio && (
                        <div>
                            {`1 ${outputTokenName} = ${ratio.substring(0,8)} ${inputTokenName}`}
                        </div>
                    )}
                </div>

                {/* Swap Button */}
                <div className="swapButtonContainer" >
                    {account ? (
                        <div
                            onClick={() => runSwap(transaction, inputAmount)}
                            className="swapButton"
                            disabled={outputAmount === undefined}
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