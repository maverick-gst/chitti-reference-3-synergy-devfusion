import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Header from '@/app/(landing)/components/Header'
import { PrismaClient } from '@/prisma/generated/mongo'
import prismadb from '@/lib/prismadb'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maverick Sparks',
  description: 'MicroSaaS marketplace by Maverick Tech Group',
}

async function AuthCheck({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0].emailAddress as string;
  //console.log(userEmail, '---userEmail');
  
  if (user) {
    try {
      // const allowedUser = await prismadb.prisma_mongo.user.findUnique({
      //   where: { email: userEmail }
      // })
      const allowedUsers = ['saiteja.gpr@gmail.com']
      //console.log(allowedUsers, '---allowedUser');
      if (!allowedUsers.includes(userEmail)) {
        redirect('/unauthorized');
      }
    } catch (error) {
      console.log(error, '---error');
      redirect('/unauthorized');
    }

  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <ReactQueryProvider>
            
            <main className="flex-grow">
              <AuthCheck>
                
                {children}</AuthCheck>
            </main>
            <footer className="bg-gray-800 text-white py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; 2023 Maverick Spark - A Maverick Tech Group Marketplace. All rights reserved.</p>
              </div>
            </footer>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
