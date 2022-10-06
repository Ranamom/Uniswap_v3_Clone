import React, { useContext } from 'react'
import PageButton from './PageButton'
import userContext from './context/userContext'

const Navbar = () => {
    const context = useContext(userContext)
    const {
        onClickConnector,
        disconnectWallet,
        account
    } = context

    // const {
    //     getWalletAddress,
    //     signerAddress
    // } = props

    const displayAddress = `${account?.substring(0, 20)}...`

    const onClickConnectWallet = () => {
        if (!account) {
            onClickConnector()
        }

    }

    return (
        <div className="appNav">
            <img src="https://seeklogo.com/images/U/uniswap-logo-782F5E6363-seeklogo.com.png" alt="uniswap-logo" style={{ height: "30px", width: "auto", position: "absolute", left: "10%", top: "2%" }} />

            <div className="my-2 buttonContainer buttonContainerTop">
                <PageButton name={"Swap"} isBold={true} />
            </div>

            <div className="rightNav">
                <div className="connectButtonContainer">
                    <div
                        className="btn my-2 connectButton"
                        onClick={onClickConnectWallet}
                    >
                        {account ? displayAddress : "Connect Wallet"}
                    </div>
                    {account &&
                        <div
                            className="btn my-2 connectButton"
                            onClick={disconnectWallet}>
                            Disconnect
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}

export default Navbar