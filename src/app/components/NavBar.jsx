"use client"
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function NavBar(){
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
 
    return(
        <div className='self-center text-center h-fit flex flex-col'>
            <h1 className="text-3xl font-bold my-5">Welcome to the Task Tracker!</h1>
            <div>
                <nav className='flex flex-row flex-nowrap justify-evenly align-middle text-2xl underline my-2'>
                <Link href="/">Home</Link>
                

                <SignedOut>
                  <Link href="/sign-in">Sign-In</Link>
                </SignedOut>
                <SignedIn>
                <Link href="/task-list">Task List</Link>                
                </SignedIn> 
                <SignedOut>
                  <Link href="/sign-up" >Sign-Up</Link>
                </SignedOut> 
                <SignedIn>
                <UserButton afterSignOutUrl="/"/>
                </SignedIn> 
                
                </nav>
            </div>

        </div>
)
}
