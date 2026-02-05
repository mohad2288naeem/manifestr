import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Header from '../components/layout/Header'
import Hero from '../components/layout/Hero'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (!loading && user && !user.onboarding_completed) {
  //     router.push('/onboarding')
  //   }
  // }, [user, loading, router])

  return (
    <>
      <Head>
        <title>Manifestr - Elevate Your Game</title>
        <meta name="description" content="Manifestr - Execute faster. Think bigger." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <Hero />
        </main>
        <Footer />
      </div>
    </>
  )
}
