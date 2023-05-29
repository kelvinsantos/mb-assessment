/* pages/_app.js */
import { useState } from 'react'
import '../styles/globals.css'
import Link from 'next/link'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import useNetworks from '../custom_hooks/useNetworks';
import MetamaskProvider from '../providers/MetamaskProvider'
import Wallet from './wallet';

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function MyApp({ Component, pageProps }) {
  const [loaded, setLoaded] = useState(false)
  const [networks, saveNetworks, setSelected] = useNetworks();
  const selectedNetwork = networks.filter(v => v.selected)[0];

  pageProps.networks = networks;
  pageProps.saveNetworks = saveNetworks;
  pageProps.setSelected = setSelected;

  function loadNetworkDropdown() {
    return (
      <>
        {
          <div className="dropdown inline-block relative">
            <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
              <span className="mr-1">{selectedNetwork.label}</span>
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
            </button>
            <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
              {
                networks.map(network => {
                  return (
                    <li key={network.label}>
                      <a className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#" onClick={() => {
                        setSelected(network.label)
                      }}>{network.selected ? <b>{network.label}</b> : network.label}</a>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        }
      </>
    )
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetamaskProvider>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <nav className="border-b p-6">
              <div className='grid gap-6 mb-6 md:grid-cols-2'>
                <div>
                  <p className="text-4xl font-bold">MB Marketplace</p>
                </div>
              </div>
              <div className="flex mt-4">
                <Link href="/">
                  <a className="mr-4 text-pink-500">
                    Home
                  </a>
                </Link>
                {
                  loaded ? (
                    <><Link href="/create-nft">
                      <a className="mr-6 text-pink-500">
                        Mint NFT
                      </a>
                    </Link><Link href="/my-nfts">
                        <a className="mr-6 text-pink-500">
                          My NFTs
                        </a>
                      </Link><Link href="/dashboard">
                        <a className="mr-6 text-pink-500">
                          Dashboard
                        </a>
                      </Link></>
                  ) : <></>
                }
                <Link href="/networks">
                  <a className="mr-6 text-pink-500">
                    Networks
                  </a>
                </Link>
                <div className="flex w-2/5 justify-end">
                  {loadNetworkDropdown()}
                </div>
              </div>
            </nav>
          </div>
          <div>
            <Wallet setLoaded={setLoaded} />
          </div>
        </div>
        <Component {...pageProps} />
      </MetamaskProvider>
    </Web3ReactProvider>
  )
}

export default MyApp