import React from 'react'
import {useAddress,useDisconnect,useMetamask} from '@thirdweb-dev/react'
import Link from 'next/link'
import{
    BellIcon,
    ShoppingCartIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    
} from "@heroicons/react/24/outline"
import Image from 'next/image'

type Props = {}

function Header({}: Props) {
    const connectWithMetamask = useMetamask()
    const disconnect = useDisconnect() 
    const address = useAddress()

    return (
    <div className="max-w-6xl mx-auto p-2">
   <nav className='flex justify-between'>
    <div className='flex items-center space-x-2 text-sm'>
        {address ?(
        <button onClick={disconnect} className='connectWalletBtn'>Hi, {address.slice(0,4) + "..." + address.slice(-4)}</button>
    ):(
        <button onClick={connectWithMetamask} className='connectWalletBtn'>Connect your wallet</button>
    )}
    <p className='hidden md:inline-flex cursor-pointer '>Daily Deals</p>
    <p className='hidden md:inline-flex cursor-pointer'>Help & Contact</p>
        
    </div>
    <div className='flex items-center space-x-4   text-sm'>
        <p className='hidden md:inline-flex cursor-pointer' >Ship to </p>
        <p className='hidden md:inline-flex cursor-pointer' >Sell</p>
        <p className='hidden md:inline-flex cursor-pointer' >Watchlist</p>

        <Link href="/additem" className='flex items-center hover:link'>
            Add to Inventory
        <ChevronDownIcon className='h-4' />
        <ShoppingCartIcon className='h-4'/>  
        </Link>
    </div>
   </nav>
   <hr  className='mt-2'/>
   <section className='flex items-center space-x-2 py-2'>
    <div className='h-16 w-16 sm:w-28 md:44 cursor-pointer flex-shrink'>
        <Link href="/" >
            <Image
            className='h-full w-full object-contain'
            alt='Thirdweb logo' 
            src="https://links.papareact.com/bdb"
            width={100}
            height={100} />

        </Link>
    </div>
    <button className='hidden   lg:flex items-center w-20 space-x-2'>
        <p className='text-gray-600 text-sm'>Shop by Category</p>
        <ChevronDownIcon className='h-4 flex-shrink-0' />


    </button>
    <div className='flex items-center space-x-2 md:px-5 py-2 border-black
     border-2 flex-1'>
       <MagnifyingGlassIcon className='w-5 text-gray-400'/>
       <input 
       className='flex-1 outline-none' 
       type="text" 
       placeholder='Search for anything' /> 
    </div>
    <button className='  sm:bg-blue-600 text-white px-5 py-2 rounded 
    border-2 border-blue-600  '>Search</button>
    <Link href="/create">
    <button className=' border-2 border-blue-600 px-5  md:px-10 py-2
    text-blue-600 hover:bg-blue-600/50  hover:text-white rounded'>List Item</button>
    </Link>
   </section>
   <hr />
   <section className='flex  items-center py-3 space-x-6 text-xs md:text-sm justify-center px-6'>
    <p className='link '>Home</p>
    <p className='link '>Electronics</p>
    <p className='link '>Computers</p>
    <p className='link hidden sm:inline'>Video games</p>
    <p className='link hidden sm:inline'>Home & Garden</p>
    <p className='link hidden md:inline'>Health & Beauty</p>
    <p className='link hidden lg:inline'>Collections & Art</p>
    <p className='link hidden lg:inline'>Books</p>
    <p className='link hidden lg:inline'>Music</p>
    <p className='link hidden xl:inline'>Deals</p>
    <p className='link hidden xl:inline'>Other</p>
    <p className='link '>More</p>
   </section>
   </div>
  )
}

export default Header