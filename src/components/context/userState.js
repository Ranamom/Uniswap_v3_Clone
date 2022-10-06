import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import UserContext from './userContext'
import { useState, useEffect } from 'react'
import { ethers, providers } from 'ethers'

const UserState = (props) => {

    let provider;
    let signer;
    let ethersProvider;
    const [account, setAccount] = useState(null)
    const [web3Modal, setWeb3Modal] = useState(null)

    useEffect(() => {
        const providerOptions = {
            binancechainwallet: {
                package: true
            },
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: 'a46c4873075d48ec92fe67b184a6fbdb',
                }
            },
            walletlink: {
                package: WalletLink,
                options: {
                    appName: "Uniswap V3 Clone",
                    infuraId: "a46c4873075d48ec92fe67b184a6fbdb",
                    rpc: "",
                    chainId: 5,
                    appLogoUrl: null,
                    darkMode: true
                }
            },
        };

        const newWeb3Modal = new Web3Modal({
            cacheProvider: true, // very important
            network: "goerli",
            theme: {
                background: "rgb(203, 231, 240)",
                main: "black",
                secondary: "black",
                hover: "#dd2f81"
            },
            providerOptions,
        });

        setWeb3Modal(newWeb3Modal)
    }, [])

    useEffect(() => {
        // connect automatically and without a popup if user is already connected
        if (web3Modal && web3Modal.cachedProvider) {
            onClickConnector()
        }
    }, [web3Modal])

    const onClickConnector = async () => {
        provider = await web3Modal.connect()
        addListeners(provider)
        ethersProvider = new providers.Web3Provider(provider)
        signer = ethersProvider.getSigner()
        const userAddress = await ethersProvider.getSigner().getAddress()
        setAccount(userAddress)
    }

    async function disconnectWallet() {
        web3Modal.clearCachedProvider()
        localStorage.removeItem("walletconnect")
        setAccount("")
    }

    async function addListeners(web3ModalProvider) {
        web3ModalProvider.on("accountsChanged", async (accounts) => {
            const userAddress = await ethersProvider.getSigner().getAddress()
            setAccount(userAddress)
        })
    }

    return (
        <UserContext.Provider value={{ ethersProvider, provider, signer, onClickConnector, account, disconnectWallet }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState