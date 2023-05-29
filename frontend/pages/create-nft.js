/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { useWeb3React } from '@web3-react/core'

const IPFS_GATEWAY_URL = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL;
const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL;

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;
const authorization = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const NEXT_PUBLIC_MB_API_URL = process.env.NEXT_PUBLIC_MB_API_URL;

// https://infura.io/
const client = ipfsClient({
  url: `${IPFS_API_URL}/api/v0`,
  headers: {
    authorization,
  }
});

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreateItem({ networks }) {
  const { account } = useWeb3React()

  const [fileUrl, setFileUrl] = useState(null)
  const [showDanger, setShowDanger] = useState(false)
  const [dangerMessage, setDangerMessage] = useState('')
  const [formInput, updateFormInput] = useState({ nric: '', name: '', description: '' })
  const selectedNetwork = networks.filter(v => v.selected)[0]
  const router = useRouter()

  const createUser = async (requestData) => {
    try {
      const res = await fetch(`${NEXT_PUBLIC_MB_API_URL}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const data = await res.json();

      if (data.success) return data;
      else {
        setShowDanger(true);
        setDangerMessage(data.reason);
      }

      return;
    } catch (err) {
      setShowDanger(true);
      setDangerMessage(e.reason);
      console.log(err);
    }
  };

  async function onChange(e) {
    const file = e.target.files[0]

    try {
      const added = await client.add(
        file
      )
      const url = `${IPFS_GATEWAY_URL}/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      setShowDanger(true);
      setDangerMessage('Error uploading file');
      console.log('Error uploading file: ', error)
    }
  }
  async function uploadToIPFS() {
    const { name, description } = formInput
    if (!name || !description || !fileUrl) return

    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })

    try {
      const added = await client.add(data)
      const url = `${IPFS_GATEWAY_URL}/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      setShowDanger(true);
      setDangerMessage('Error uploading file');
      console.log('Error uploading file: ', error)
    }
  }

  async function listNFTForSale() {
    const { nric } = formInput;
    if (!nric) return

    try {
      const user = await createUser({
        nric,
        wallet_address: account
      });

      if (!user) return;

      const url = await uploadToIPFS()
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
      })
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      /* next, create the item */
      const mintPrice = ethers.utils.parseUnits('1', 'ether')
      const contract = new ethers.Contract(selectedNetwork.contract_address || marketplaceAddress, NFTMarketplace.abi, signer)

      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()

      let transaction = await contract.createToken(url, mintPrice, user.receipt, { value: listingPrice })
      await transaction.wait()

      router.push('/my-nfts')
    } catch (e) {
      if (e.data) {
        setShowDanger(true);
        setDangerMessage(e.data.data.reason);
      }
      console.log('e::', e)
    }
  }

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShowDanger(false);
    }, 3000);

    return () => {
      clearTimeout(timeId)
    }
  }, [showDanger])

  return (
    <>
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input
            placeholder="NRIC"
            className="mt-8 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, nric: e.target.value })}
          />
          <input
            placeholder="Asset Name"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
          <input
            type="file"
            name="Asset"
            className="my-4"
            onChange={onChange}
          />
          {
            fileUrl && (
              <img className="rounded mt-4" width="350" src={fileUrl} />
            )
          }
          <div class={`px-4 py-3 leading-normal text-red-100 bg-red-700 rounded-lg mt-4 ${showDanger ? '' : 'invisible'}`} role="alert">
            <p>{dangerMessage}</p>
          </div>
          <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
            Mint NFT
          </button>
        </div>
      </div>
    </>

  )
}