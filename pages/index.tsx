import { BanknotesIcon, ClockIcon } from '@heroicons/react/24/outline'
import {
  useActiveListings,
  useContract,
  MediaRenderer,
  useListings
} from '@thirdweb-dev/react'
import { ListingType } from '@thirdweb-dev/sdk'
import type { NextPage } from 'next'
import Link from 'next/link'
import Header from '../components/Header'

const Home: NextPage = () => {
  const {contract} =useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,"marketplace")
  const {  data:listings,isLoading:loadingListings }=useActiveListings(contract,{})
 

  return (
    <div className="">
     <Header />
<main className=' max-w-6xl mx-auto p-2'>
  {loadingListings?
   ( 
   <p className='text-center animate-pulse text-blue-400'>Loading listing </p>
   ):(
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-5 mx-auto'>
      {listings?.map(listing=>(
  <Link key={listing.id} href={`/listing/${listing.id}`} 
  className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out">
        <div  >
              <div className=' flex flex-1  flex-col items-center pb-2'>
                <MediaRenderer src={listing.asset.image} className=""/>
              </div>

              <div className='pt-3 space-y-4'>
                <div>
                  <h2 className='text-lg truncate'>{listing.asset.name}</h2>
                  <hr />
                  <p className='truncate text-sm text-gray-600 mt-2'>{listing.asset.description}</p>
                </div>
              </div>
              <p className=''><span className='font-bold mr-1'>{listing.buyoutCurrencyValuePerToken.displayValue}</span> {listing.buyoutCurrencyValuePerToken.symbol}</p>
              <div className={`flex items-center ml-auto space-x-2 justify-end text-xs 
                          border w-fit p-2 rounded-lg text-white ${
                            listing.type === ListingType.Direct ?
                            "bg-blue-600":"bg-red-600"
                          }`}>
                        <p>
                          {listing.type===ListingType.Direct? "Buy Now":"Auction"}
                        </p>
                        {listing.type==ListingType.Direct?(
                          <BanknotesIcon  className='h-4'/>
                        ):(
                          <ClockIcon className='h-4' />
                        )}
               </div>
        </div>
        </Link>
      )
    
      )}
    </div>
   )}
</main>

    </div>
  )
}

export default Home