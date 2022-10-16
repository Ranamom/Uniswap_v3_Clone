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

    // web3Modal 
    const [signerInstance, setSignerInstance] = useState(null)
    const [router, setRouter] = useState(null)
    const [expProvider, setexpProvider] = useState(null)
    const [account, setAccount] = useState(null)
    const [web3Modal, setWeb3Modal] = useState(null)
    const [connected, setConnected] = useState(false)

    // Contracts
    const [wethContract, setWethContract] = useState(null)
    const [uniContract, setUniContract] = useState(null)
    const [linkContract, setLinkContract] = useState(null)
    const [daiContract, setDaiContract] = useState(null)
    const [quoterContract, setQuoterContract] = useState(null)

    const [inputToken, setInputToken] = useState(null) //done
    const [inputTokenName, setInputTokenName] = useState('WETH')
    const [outputTokenName, setOutputTokenName] = useState('UNI')
    const [outputToken, setOutPutToken] = useState(null)
    const [inputContract, setInputContract] = useState(null)
    const [outputContract, setOutputContract] = useState(null)
    const [mode, setMode] = useState(null)

    const [userETHbalance, setUserETHBalance] = useState(null)
    const [ratio, setRatio] = useState(null) 

    const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'

    const WETH = new Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether')
    const UNI = new Token(5, '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, 'UNI', 'Uniswap Token')
    const LINK = new Token(5, '0x326C977E6efc84E512bB9C30f76E30c160eD06FB', 18, 'LINK', 'ChainkLink Token')
    const DAI = new Token(5, '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', 18, 'DAI', 'DAI Token')

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

        signer = ethersProvider.getSigner()
        setSignerInstance(signer)
        const acc = await ethersProvider.getSigner().getAddress()
        setAccount(acc)
        setConnected(true)

        const wethContractInstance = new ethers.Contract('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', abi, ethersProvider)
        setWethContract(wethContractInstance)

        const uniContractInstance = new ethers.Contract('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', abi, ethersProvider)
        setUniContract(uniContractInstance)

        const linkContractInstance = new ethers.Contract('0x326C977E6efc84E512bB9C30f76E30c160eD06FB', abi,  ethersProvider)
        setLinkContract(linkContractInstance)

        const daiContractInstance = new ethers.Contract('0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', abi, ethersProvider)
        setDaiContract(daiContractInstance)

        const quoterContractInstance = new ethers.Contract('0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6', QuoterABI.abi, ethersProvider)
        setQuoterContract(quoterContractInstance)

        setInputToken(WETH) 
        setOutPutToken(UNI) 
        setInputContract(wethContractInstance)
        setOutputContract(uniContractInstance)
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
        const wei = ethers.utils.parseUnits(inputAmount.toString(), 18)
        const currencyAmount = CurrencyAmount.fromRawAmount(inputToken, JSBI.BigInt(wei))
        await router.route(
            currencyAmount,
            outputToken,
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

    async function runSwap(transaction, inputAmount){
        console.log(inputAmount)
        const approvalAmount = ethers.utils.parseUnits(inputAmount.toString(), 18)
        const contract0 = wethContract
        await contract0.connect(signerInstance).approve(
            V3_SWAP_ROUTER_ADDRESS,
            approvalAmount
        ).then(res => signerInstance.sendTransaction(transaction))
    }
    
    return (
        <UserContext.Provider value={{ ethersProvider, provider, signer, onClickConnector, account, disconnectWallet, wethContract, uniContract, daiContract, linkContract, userETHbalance, connected, web3Modal, expProvider, quoterContract, ratio, setRatio, getPrice, runSwap, signerInstance, inputToken, setInputToken, inputContract, setInputContract,outputToken, setOutPutToken, outputContract, setOutputContract, WETH, UNI, DAI, LINK, inputTokenName, setInputTokenName, outputTokenName, setOutputTokenName, mode, setMode}}>    
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState