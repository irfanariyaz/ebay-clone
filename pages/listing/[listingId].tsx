import { UserCircleIcon } from '@heroicons/react/24/outline'
import { MediaRenderer, 
        useContract,
        useListing,
        useNetwork,
        useNetworkMismatch,
        useMakeBid,
        useMakeOffer,
        useBuyNow,
        useAddress,
        useOffers,
        useAcceptDirectListingOffer
         } from '@thirdweb-dev/react'
import { ListingType, NATIVE_TOKENS } from '@thirdweb-dev/sdk'
import { useRouter } from 'next/router'
import { format } from 'path'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Countdown from "react-countdown"
import networks from '../../utils/networks'
import { type } from 'os'
import { ethers } from 'ethers'


function listingPage() {
  const address = useAddress()
    
    const router = useRouter()
    const {listingId} = router.query as {listingId:string}
    const [minimumNextBid,setMinimumNextBid] = useState<{
      displayValue:string,
      symbol:string}>()
    const [bidAmount,setBidAmount]=useState("")
    const networkMismatch = useNetworkMismatch();
    const [,switchNetwork] = useNetwork();
    
   
    const {contract} = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,"marketplace")
    const {mutate: buyNow } = useBuyNow(contract);
    const {mutate: makeOffer} = useMakeOffer(contract);
    const {data:offers}= useOffers(contract, listingId);
    const {mutate:acceptDirectOffer}=useAcceptDirectListingOffer(contract)
    console.log("offers",offers)
    const{data:listing,isLoading,error}= useListing(contract,listingId);
    const { mutate: makeBid } = useMakeBid(contract);
    const currencyContractAddress = NATIVE_TOKENS[networks].wrapped.address;
//  console.log("listype",listing?.type,ListingType.Auction)
//  const lt=listing?.typeNATIVE_TOKENS[networks].wrapped.address


      useEffect(()=>{
        if(!listingId || !contract|| !listing) return

        if( listing.type=== ListingType.Auction ){
          fetchMinNextBid()
        }
      },[listingId,listing,contract]);

     const fetchMinNextBid= async()=>{
            if(!listingId || !contract) return

            const {displayValue,symbol}  = await contract.auction.getMinimumNextBid(listingId)

            setMinimumNextBid({
              displayValue:displayValue,
              symbol:symbol
            })
       }


const formatPlaceholder = ()=>{
  if(!listing) return
  if(listing.type === ListingType.Direct){
    return "Enter the offer amount"
  }
  if(listing.type ==ListingType.Auction){
    return Number(minimumNextBid?.displayValue)===0 ?
  "Enter bid amount" :`${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`

 }
  
}

const buyNft =async()=>{
          if(networkMismatch){
            switchNetwork && switchNetwork(networks)
            return
          }
          if(!contract || !listing || !listingId)return;

        await buyNow({
          id: listingId,
          buyAmount:1,
          type: listing.type,
        },{
          onSuccess(data, variables, context) {
            alert("NFT bought successfully")
              console.log("SUCCESS",data,variables,context)
              router.replace('/')
          },
          onError(error, variables, context) {
            alert("ERROR: NFTs could not be bought")    
            console.log("ERROR",error,variables,context)              
            },
          
        })
}
const createBidOrOffer= async ()=>{
  try{
      if(networkMismatch){
        switchNetwork && switchNetwork(networks)
        return
      }
      //direct
      if(listing?.type === ListingType.Direct){
        if(listing.buyoutPrice.toString() === ethers.utils.parseEther(bidAmount).toString()){
            buyNft()
            return
        }
        console.log("Buy out price  met ,making offers...",bidAmount,listingId,currencyContractAddress);

        await makeOffer({
         
          listingId:listingId,
          pricePerToken:bidAmount,
          quantity:1,
          
        },
       {   onSuccess(data, variables, context) {
            alert("Offer made successfully")
              console.log("SUCCESS",data,variables,context)
              router.replace('/')
              
          },
          onError(error, variables, context) {
            alert("ERROR: Offer could not be made")    
            console.log("ERROR",error,variables,context)              
            },}       
      )}

      //auction
      if(listing?.type === ListingType.Auction){
console.log("making bid")
        await makeBid({
          listingId,
          bid:bidAmount
        },{
  onSuccess(data, variables, context) {
    alert("Bid made successsfully")
      console.log("SUCCESS",data,variables,context)
      setBidAmount('')
      router.push('/')
  },
  onError(error, variables, context) {
      alert("ERROR: Bid was not made")
      console.log("ERROR",error,variables,context)
  },
})}


  }catch(error){
      console.log(error)
  }
}
    if(isLoading) {
      return(
    <div>
      <Header />
      <p className='text-center animate-pulse text-blue-400'>Loading items...</p>
    </div>)
    }
     if(!listing){
      return <div>Listing not found</div>
      }
      
     
    

  
  return (
    <div> 
        <Header />
        <main  className='max-w-6xl mx-auto p-2 flex flex-col lg:flex-row
        space-y-10 space-x-5 pr-10'>
            <div  className=' p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl '>
              <MediaRenderer src={listing.asset.image}/>
            </div>
            <section className='flex1 space-y-5 pb-20 lg:pb-0 '>
              <div>
                <h1 className='text-xl font-bold'> {listing.asset.name} </h1>
                <p className='text-gray-300'>{listing.asset.description}</p>
                <p className='flex items-center text-sm sm:text-base'>
                  <UserCircleIcon className='h-5 '/>
                 <span className='font-bold p-1'>Seller: </span> {listing.sellerAddress}</p>
              </div>
              <div className='grid grid-cols-2 items-center py-2 '>
                <p className='font-bold'>Listing type</p>
                <p>{listing.type === ListingType.Direct ? "Direct Listing" :
                "Auction Listing"}</p>
                <p className='font-bold'>But it now Price</p>
                <p className='text-xl font-bold'>{listing.buyoutCurrencyValuePerToken.displayValue}{" "}{listing.buyoutCurrencyValuePerToken.symbol}</p>
                <button onClick={buyNft} className='col-start-2 bg-blue-600 font-bold rounded-full px-10 py-4 mt-2 text-white w-44 '>
                      Buy Now
                </button>

              </div>
{/* {if direct show offers here} */}
                {listing.type == ListingType.Direct&& offers &&(
                  <div className='grid grid-cols-2 items-center gap-y-2 '>
                    <p className='font-bold'>Offers:</p>
                    <p className='font-bold'>{offers.length}</p>

                    {offers.map((offer)=>(
                      <>
                      <p className='flex items-center ml-5 text-sm italic'>
                        <UserCircleIcon className='h-3 mr-2'/>
                        {offer.offeror.slice(0,5) +
                        "..." +offer.offeror.slice(-5) }</p>
                        <div >
                          <p key={
                            offer.listingId+offer.offeror+offer.totalOfferAmount.toString()
                          }
                          className='text-sm italic'>
                            {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                            {NATIVE_TOKENS[networks].symbol}
                          </p>
                          {listing.sellerAddress !== address &&(
                            <button  onClick={()=>{
                              acceptDirectOffer({
                                listingId,
                                addressOfOfferor:offer.offeror
                              },{
                                onSuccess(data, variables, context) {
                                
                                    alert("Offer made successfully")
                                    console.log("SUCCESS",data,variables,context)
                                    router.replace('/')
                                  
                                },
                                onError(error, variables, context) {
                                  alert("ERROR: Offer could not be made")    
                                  console.log("ERROR",error,variables,context)              
                                  },
                                
                              }
                              )}}
                            className ="p-2 w-32 bg-red-500/50 rounded-lg font-bold text-xs cursor-pointer">
                                                           Accept Offer
                            </button>
                          )}
                        </div>
                      </>
                    ))}
                  </div>

                )}
              <div className='grid grid-col-2 space-y-2 items-center' >
                <hr  className='col-span-2'/>
                <p className='col-span-2 font-bold'>
                  {listing.type === ListingType.Direct
                  ? "Make an offer" :
                  "Bid on this Auction"}
                </p>
                {/* {remaining time on auction goes here} */}

                {listing.type === ListingType.Auction && (
                  <>
                  <p>Current Minimum Bid: </p>
                  <p>{minimumNextBid?.displayValue} {minimumNextBid?.symbol}</p>

                  <p>Time remaining</p>
                 <Countdown
                 date= {Number(listing.endTimeInEpochSeconds.toString())*1000} />
                 
                 </>
                )}
                      <input 
                      onChange={e=>setBidAmount(e.target.value)} className='border p-2 rounded-lg mr-5' type="text" placeholder={formatPlaceholder()} />
                      <button onClick={createBidOrOffer} className='bg-red-600 font-bold rounded-full px-10 py-4 
                                             text-white
                                             col-start-2 mt-2  w-44 '>
                        {listing.type === ListingType.Direct? "Offer":"Bid"}
                        </button>
              </div>
            </section>
        </main>
    </div>
  )
}

export default listingPage