import React, { FormEvent, useState } from 'react'
import Header from '../components/Header'
import {useAddress,useContract} from '@thirdweb-dev/react'
import { Description } from '@ethersproject/properties'
import { useRouter } from 'next/router'
type Props = {}

function additem({}: Props) { 
    
     const address = useAddress()
     const router = useRouter()
     const[preview,setPreview ]=useState<string>()
     const[image,setImage ]=useState<File>()
    const {contract } = useContract(process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,'nft-collection')
    
    console.log(contract)
    const minNFT = async(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if (!contract || !address) return
        if (!image){
            alert("Please select an image") 
            return 
        }
        //custom type defenition
        const target = e.target as typeof e.target &{
            name:{ value : string }
            description:{ value : string }
        }
        const metadata ={
            name : target.name.value,
            description : target.description.value,
            image : image, //image url or file
        }
        try{
            console.log("inside try")
            const tx = await contract.mintTo(address,metadata)
            const reciept = tx.receipt//transaction reciept
            const tokenId = tx.id
            const nft = await tx.data()

            console.log(reciept,tokenId,nft)
            router.push("/")

        }catch(error){
            console.error(error)
        }
        

    }
  
  return (
    <div>
        <Header />
        <main className='max-w-6xl mx-auto px-4 p-10 border-2'>
            <h1 className='text-4xl font-bold'>Add an item to the Marketplace</h1>
            <h2 className='text-xl font-semibold pt-5'>Item Details</h2>
            <p className=''>By adding an item to the marketplace, you are essentially minting an NFT of the item into your wallet which we can then list for sale!</p>
            <div className='flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5'>
                <img className='border h-80 w-80 object-contain' src={preview ||"https://links.papareact.com/ucj"} alt="" />
                {/* <div className=''> */}
                    <form onSubmit={minNFT} className='flex flex-col flex-1 p-2 space-y-2 ' action="">
                        <label className='font-light '>Name of item</label>
                        <input className='formFiled' 
                        type="text" placeholder='Name of Item'
                         name="name" id="name"/>

                        <label className='font-light ' >Description</label>
                        <input className='formFiled' 
                        type="text"  placeholder='Description'
                        name="description" id="description"/>

                        <label className='font-light ' >Image of Item</label>
                        <input className='p-5' type="file"  onChange={e=>{
                            if(e.target.files?.[0]){
                                setPreview(URL.createObjectURL(e.target.files[0]))
                                setImage(e.target.files[0])
                            }
                        }}/>

                        <button type='submit' className='px-10 py-4 mx-auto md:mt-auto mt-5 
                                 md:ml-auto bg-blue-600 rounded-full w-56 
                                 font-bold text-white'>Add/mint item</button>
                    </form>
                {/* </div> */}
            </div>
        </main>

    </div>
  )
}

export default additem