import Head from 'next/head'
import { useState } from 'react'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import VaultHeader from '../../components/vault/VaultHeader'
import VaultSearchBar from '../../components/vault/VaultSearchBar'
import VaultGrid from '../../components/vault/VaultGrid'

export default function VaultRecents() {
  const [viewMode, setViewMode] = useState('grid')

  // Sample data for recent document cards
  const documentCards = [
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Review',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Final',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Draft',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    // Second row
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Review',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Final',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
    {
      title: 'Manifestr Collab',
      project: 'Project: Brand Refresh',
      status: 'Draft',
      collaborators: [
        { name: 'John', avatar: null },
        { name: 'Sarah', avatar: null },
        { name: 'Mike', avatar: null },
        { name: 'Emma', avatar: null },
        { name: 'David', avatar: null },
        { name: 'Lisa', avatar: null },
        { name: 'Tom', avatar: null },
      ],
      lastEdited: '2 hours ago',
    },
  ]

  // Background image URL for the header
  const headerBackgroundImage = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/banners/abstract-white-wave.png`
    : 'http://localhost:3000/assets/banners/abstract-white-wave.png'

  return (
    <>
      <Head>
        <title>Recents - The Vault - Manifestr</title>
      </Head>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Section */}
        <VaultHeader
          title="THE vault recents"
          description="Your secure workspace for every project, deck & document."
          backgroundImage={headerBackgroundImage}
          showActionButtons={false}
        />

        {/* Search and Filters */}
        <VaultSearchBar
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Documents Grid - No folders section for Recents */}
        <VaultGrid cards={documentCards} showTitle={false} viewMode={viewMode} />
      </div>
    </>
  )
}

VaultRecents.getLayout = function getLayout(page) {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <AppHeader />
      <SidebarLayout>
        {page}
      </SidebarLayout>
    </div>
  )
}

