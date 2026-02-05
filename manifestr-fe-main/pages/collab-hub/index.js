import Head from 'next/head'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'

export default function CollabHub() {
  return (
    <>
      <Head>
        <title>Collab Hub - Manifestr</title>
      </Head>
      <div className="min-h-screen bg-[#f4f4f4]">
        <AppHeader />
        
        <SidebarLayout>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-8">
              <h1 className="text-[32px] font-bold leading-[40px] text-[#18181b] mb-4">
                Collab Hub
              </h1>
              <p className="text-[16px] leading-[24px] text-[#71717a]">
                Welcome to the Collab Hub. Select an item from the sidebar to get started.
              </p>
            </div>
          </div>
        </SidebarLayout>
      </div>
    </>
  )
}

