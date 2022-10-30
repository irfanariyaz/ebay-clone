import { useAddress, 
         useContract,
         MediaRenderer,
         useNetwork,
         useOwnedNFTs,
         useNetworkMismatch,
         useCreateAuctionListing,
         useCreateDirectListing
         } from '@thirdweb-dev/react'
import { ChainId, NFT,
    NATIVE_TOKENS,NATIVE_TOKEN_ADDRESS
} from '@thirdweb-dev/sdk'
import Router, { useRouter } from 'next/router'

import React, { FormEvent, useState } from 'react'
import Header from '../components/Header'
import networks from '../utils/networks'


type Props = {}

const Create = (props: Props) => {
    const address = useAddress()
    const router = useRouter()
    const {contract} =useContract(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,'marketplace')
    const {contract:collectionContract} =useContract(
        process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,'nft-collection')
    const [selectNFT,setSelectNFT] = useState<NFT>();
    const ownedNFTs = useOwnedNFTs(collectionContract,address)
    const networkMismatch = useNetworkMismatch();
    const [,switchNetwork] = useNetwork();


    const {mutate: createDirectListing ,isLoading,error } = useCreateDirectListing(contract);

    const {mutate: createAuctionListing ,isLoading:isLoadingAuction,error:errorAuction } = useCreateAuctionListing(contract)

const handleCreateListing =async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(networkMismatch){
        switchNetwork && switchNetwork(networks)
        return;
    }
    if(!selectNFT) return;

    
    const target = e.target as typeof e.target &{
        elements:{listingType:{ value : string };price:{ value : string }}
    };
    const {listingType,price} = target.elements
    console.log(listingType,price)

    if(listingType.value ==='directListing'){
        console.log('directlisting')
        createDirectListing({
            assetContractAddress:process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
            tokenId:selectNFT.metadata.id,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            listingDurationInSeconds: 60*60*24*7,//1week,
            quantity:1,
            buyoutPricePerToken:price.value,
            startTimestamp:new Date()
            //! to ensure that ita defenitly that
        },{
          onSuccess(data, variables, context) {
              console.log('SUCCESS',data, variables, context)
              router.push('/')
          },
          onError(error, variables, context) {
            console.log('ERROR',error, variables, context)
          },
        })
    }
    
    if(listingType.value === 'auctionListing'){
        createAuctionListing({
            assetContractAddress:process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
            tokenId:selectNFT.metadata.id,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            listingDurationInSeconds: 60*60*24*7,//1week,
            quantity:1,
            buyoutPricePerToken:price.value,
            startTimestamp:new Date(),
            reservePricePerToken:0
        },{
            onSuccess(data, variables, context) {
                console.log('SUCCESS',data, variables, context)
              router.push('/')
            },
            onError(error, variables, context) {
                console.log('ERROR',error, variables, context)
              },
        })
    }
}
  return (
  <div>
        <Header />
        <main className='mx-w-6xl mx-auto p-10 pt-2'>
            <h1 className='text-4xl font-bold'>List an item</h1>
            <h2 className='text-xl font-semibold pt-5'>Select an item you would like to sell</h2>
            <hr className='mt-5' />
            <p>
               Below you will  find the NFT's you own in your Wallet
            </p>
            <div className='flex overflow-x-scroll space-x-2'>
                {ownedNFTs?.data?.map(nft => (
                    <div key={nft.metadata.id}
                    onClick={()=>setSelectNFT(nft)}
                    className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 w-56
                                ${nft.metadata.id === selectNFT?.metadata.id ? "border-black ": "border-transparent"}                  `}>
                        <MediaRenderer className='h-48 w-fit rounded ' src={nft.metadata.image} />
                        <p className='text-lg truncate font-bold'>{nft.metadata.name}</p>
                        <p className='text-xs truncate'>{nft.metadata.description}</p>
                    </div>
                ))}
            </div>
           {selectNFT && (
            <form onSubmit= {handleCreateListing} action="">
                <div className='flex flex-col p-10'>
                    <div className="grid grid-cols-2 gap-5">
                        <label className='border-r font-light'>Direct Listing / Fixed Listing </label>
                        <input type="radio" name='listingType' 
                         value='directListing'
                         className='ml-auto h-10 w-10'/>

                        <label className='border-r font-light'>Auction</label>
                        <input type="radio" name='listingType'
                         value='auctionListing'
                         className='ml-auto h-10 w-10' />

                         <label className='border-r font-light'>Price</label>
                         <input type="text" placeholder='0.05' 
                         className='bg-gray-100 p-5' name='price'/>
                    </div>
                    <button type='submit'className='bg-blue-600 p-4 mt-8 text-white rounded'>Create Listing</button>
                </div>
            </form>
           )}  
        </main>
   </div>
  )
}

export default Create