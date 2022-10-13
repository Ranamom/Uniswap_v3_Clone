import React, {useState, useEffect, useContext} from 'react'
import { GearFill, Router } from 'react-bootstrap-icons'
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { getWethContract, getUniContract, address0, address1 } from '../AlphaRouterService'
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
        signer,
        expProvider,
        wethContract,
        quoterContract,
        uniContract,
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
    const [wethAmount, setWethAmount] = useState(undefined)
    const [uniAmount, setUniAmount] = useState(undefined)

    const UNI = new Token(5, '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, "UNI", 'Uniswap token')

    useEffect(() => {
        //    flahlf
    }, [ratio])

    const getSwapPrice = async (inputAmount) => {
        if (inputAmount) {
            setLoading(true)
            setInputAmount(inputAmount)
            // const amountIn = ethers.utils.parseUnits(inputAmount, 18)
            // await quoterContract.callStatic.quoteExactInputSingle(
            //     '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
            //     '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
            //     3000,
            //     amountIn,
            //     0
            // ).then(res => {
            //     const amountOut = ethers.utils.formatUnits(res, 18)
            //     setLoading(false)
            //     setOutputAmount(amountOut)
            //     const route = await 
            // })
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
                        tokenName="WETH"
                        getSwapPrice={getSwapPrice}
                        signer={signer}
                        contract={wethContract}
                        balance={wethAmount} />
                    <CurrencyField   
                        field="output"
                        tokenName="UNI"
                        value={outputAmount}
                        signer={signer}
                        contract={uniContract}
                        balance={uniAmount}
                        spinner={BeatLoader}
                        loading={loading} />
                </div>
                <div className="ratioContainer"> 
                    {ratio && (
                        <div>
                            {`1 UNI = ${ratio.substring(0,8)} WETH`}
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