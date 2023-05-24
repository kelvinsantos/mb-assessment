import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { injected } from '../connectors'

export default function Wallet({ setLoaded }) {
  const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 1000] })
  const { chainId, account, activate, active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()

  const onClick = () => {
    activate(injectedConnector)
  }

  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        if (isAuthorized) {
          setLoaded(true)
          if (!networkActive && !networkError) {
            activateNetwork(injected)
          }
        } else {
          setLoaded(false)
        }
      })
      .catch(() => {
        setLoaded(false)
      })
  }, [activateNetwork, networkActive, networkError])

  return (
    <div className='p-5'>
      {active ? (
        <div className='text-right'>
          <div>ChainId: {chainId}</div>
          <div>Account: {account}</div>
          <div>✅ </div>
        </div>
      ) : (
        <div className='text-right'>
          <button className="font-bold mt-4 bg-pink-500 text-white rounded p-2 shadow-lg" type="button" onClick={onClick}>
            Connect
          </button>
        </div>
      )}
    </div>
  )
}