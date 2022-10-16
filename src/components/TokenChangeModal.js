import React, { useContext } from 'react'
import userContext from './context/userContext'

const TokenChangeModal = () => {
    const context = useContext(userContext)
    const {
        mode,
        wethContract,
        uniContract,
        daiContract,
        linkContract,
        setInputToken,
        setInputContract,
        setOutPutToken,
        setOutputContract,
        setInputTokenName,
        setOutputTokenName,
        WETH,
        UNI,
        LINK,
        DAI
    } = context

    const onCLickOutsideModal = () => {
        document.getElementsByClassName('token-modal')[0].style.display = "none"
    }

    const onClickTokenChanger = (value) => {
        if (mode === 'input') {
            if (value === 'WETH') {
                setInputToken(WETH)
                setInputContract(wethContract)
                setInputTokenName(value)
            }
            else if (value === 'UNI') {
                setInputToken(WETH)
                setInputContract(wethContract)
                setInputTokenName(value)
            }
            else if (value === 'LINK') {
                setInputToken(LINK)
                setInputContract(linkContract)
                setInputTokenName(value)
            }
            else if (value === 'DAI') {
                setInputToken(DAI)
                setInputContract(daiContract)
                setInputTokenName(value)
            }
        }
        else if (mode === 'output') {
            if (value === 'WETH') {
                setOutPutToken(WETH)
                setOutputContract(wethContract)
                setOutputTokenName(value)
            }
            else if (value === 'DAI') {
                setOutPutToken(DAI)
                setOutputContract(daiContract)
                setOutputTokenName(value)
            }
            else if (value = 'LINK') {
                setOutPutToken(LINK)
                setOutputContract(linkContract)
                setOutputTokenName(value)
            }
            else if (value = 'UNI') {
                setOutPutToken(UNI)
                setOutputContract(uniContract)
                setOutputTokenName(value)
            }
        }
        else if (mode === null){

        }
    }

    return (
        <>
            <div className="token-modal" onClick={onCLickOutsideModal}>
                <div className="token-modal-container">
                    <div className="tokens">
                        <div className="token">
                            <div className="imgContainer">
                                <img src="https://cdn4.iconfinder.com/data/icons/cryptocoins/227/ETH-alt-512.png" alt="LINK" srcset="" style={{ height: "30px", width: "30px" }} />
                            </div>
                            <div className="tokenInfo" onClick={() => {onClickTokenChanger('WETH')}}>
                                <p className='tokenNaming'>Wrapped Ethereum</p>
                                <p>WETH</p>
                            </div>
                        </div>
                        <div className="token">
                            <div className="imgContainer">
                                <img src="https://seeklogo.com/images/U/uniswap-logo-782F5E6363-seeklogo.com.png" alt="LINK" srcset="" style={{ height: "30px", width: "30px", borderRadius: "30px" }} />
                            </div>
                            <div className="tokenInfo" onClick={() => {onClickTokenChanger('UNI')}}>
                                <p className='tokenNaming'>Uniswap Token</p>
                                <p>UNI</p>
                            </div>
                        </div>
                        <div className="token">
                            <div className="imgContainer">
                                <img src="https://cryptologos.cc/logos/chainlink-link-logo.png" alt="LINK" srcset="" style={{ height: "30px", width: "30px" }} />
                            </div>
                            <div className='tokenInfo' onClick={() => {onClickTokenChanger('LINK')}}>
                                <p className='tokenNaming'>ChainLink</p>
                                <p>LINK</p>
                            </div>
                        </div>
                        <div className="token">
                            <div className="imgContainer">
                                <img src="https://s2.coinmarketcap.com/static/img/coins/200x200/4943.png" alt="DAI" srcset="" style={{ height: "30px", width: "30px" }} />
                            </div>
                            <div className='tokenInfo' onClick={() => {onClickTokenChanger('DAI')}}>
                                <p className='tokenNaming'>ChainLink</p>
                                <p>DAI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default TokenChangeModal