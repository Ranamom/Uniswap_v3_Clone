import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import UserContext from './userContext'
import { useState, useEffect } from 'react'
import { ethers, providers, BigNumber } from 'ethers'
import abi from '../../abi.json'
import QuoterABI from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { AlphaRouter } from '@uniswap/smart-order-router'
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core'
import JSBI from 'jsbi'

const UserState = (props) => {

    let provider;
    let signer;
    let ethersProvider;
    const [signerInstance, setSignerInstance] = useState(null)
    const [router, setRouter] = useState(null);
    const [expProvider, setexpProvider] = useState(null)
    const [account, setAccount] = useState(null)
    const [web3Modal, setWeb3Modal] = useState(null)
    const [wethContract, setWethContract] = useState(null)
    const [uniContract, setUniContract] = useState(null)
    const [quoterContract, setQuoterContract] = useState(null)
    const [connected, setConnected] = useState(false)
    const [userETHbalance, setUserETHBalance] = useState(null)
    const [ratio, setRatio] = useState(null)

    const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
    const name0 = 'Wrapped Ether'
    const symbol0 = 'WETH'
    const decimals0 = 18
    const address0 = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

    const name1 = 'Uniswap Token'
    const symbol1 = 'UNI'
    const decimals1 = 18
    const address1 = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

    const WETH = new Token(5, address0, decimals0, symbol0, name0)
    const UNI = new Token(5, address1, decimals1, symbol1, name1)

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
    }, [userETHbalance])

    useEffect(() => {

        if (web3Modal && web3Modal.cachedProvider) {
            onClickConnector()
        }

    }, [web3Modal, userETHbalance, ratio])

    const onClickConnector = async () => {
        provider = await web3Modal.connect()
        addListeners(provider)
        ethersProvider = new providers.Web3Provider(provider)
        setexpProvider(ethersProvider)

        const routerInstance = new AlphaRouter({ chainId: 5, provider: ethersProvider })
        setRouter(routerInstance)
        // console.log(router)

        signer = ethersProvider.getSigner()
        setSignerInstance(signer)
        const acc = await ethersProvider.getSigner().getAddress()
        setAccount(acc)
        setConnected(true)

        const wethContractInstance = new ethers.Contract('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', abi, ethersProvider)
        setWethContract(wethContractInstance)

        const uniContractInstance = new ethers.Contract('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', abi, ethersProvider)
        setUniContract(uniContractInstance)

        const quoterContractInstance = new ethers.Contract('0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6', QuoterABI.abi, ethersProvider)

        const amountIn = ethers.utils.parseUnits('1', 18)
        // await quoterContractInstance.callStatic.quoteExactInputSingle(
        //     '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        //     '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        //     3000,
        //     amountIn,
        //     0
        // ).then(res => {
        //     const amountOut = ethers.utils.formatUnits(res, 18)
        //     setRatio(amountOut)
        // })
        setQuoterContract(quoterContractInstance)
    }

    async function disconnectWallet() {
        web3Modal.clearCachedProvider()
        localStorage.removeItem("walletconnect")
        setAccount("")
        setConnected(false)
    }

    async function addListeners(web3ModalProvider) {
        web3ModalProvider.on("accountsChanged", async (accounts) => {
            const userAddress = await ethersProvider.getSigner().getAddress()
            setAccount(userAddress)
        })
    }

    async function getPrice(inputAmount, slippageAmount, deadline, walletAddress) {
        const resList = [0, 0, 0]
        const percentSlippage = new Percent(slippageAmount, 100)
        const wei = ethers.utils.parseUnits(inputAmount.toString(), decimals0)
        const currencyAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))
        console.log(router)
        await router.route(
            currencyAmount,
            UNI,
            TradeType.EXACT_INPUT,
            {
                recipient: walletAddress,
                slippageTolerance: percentSlippage,
                deadline: deadline,
            }
        ).then(res => {

            const transaction = {
                data: res.methodParameters.calldata,
                to: V3_SWAP_ROUTER_ADDRESS,
                value: BigNumber.from(res.methodParameters.value),
                from: walletAddress,
                gasPrice: BigNumber.from(res.gasPriceWei),
                gasLimit: ethers.utils.hexlify(1000000)
            }

            resList[0] = transaction
            console.log(transaction)

            const quoteAmountOut = res.quote.toFixed(6)
            const ratio = (inputAmount / quoteAmountOut).toFixed(3)

            resList[1] = quoteAmountOut
            resList[2] = ratio

        }).catch(err => {
            console.log(err)
        })

        return resList
    }

    async function runSwap(transaction, signer, inputAmount){
        console.log(inputAmount)
        const approvalAmount = ethers.utils.parseUnits(inputAmount.toString(), 18)
        const contract0 = wethContract
        await contract0.connect(signer).approve(
            V3_SWAP_ROUTER_ADDRESS,
            approvalAmount
        )

        signerInstance.sendTransaction(transaction)
    }
    

    return (
        <UserContext.Provider value={{ ethersProvider, provider, signer, onClickConnector, account, disconnectWallet, wethContract, uniContract, userETHbalance, connected, web3Modal, expProvider, quoterContract, ratio, setRatio, getPrice, runSwap }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState