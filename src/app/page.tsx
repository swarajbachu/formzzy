import Image from 'next/image'
import MyForm from './form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MyForm />
    </main>
  )
}
