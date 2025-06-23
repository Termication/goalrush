import Navbar from "@/components/common/navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-2xl font-bold">DaisyUI Test</h1>

      <p>If DaisyUI is working, the second button should be blue and styled.</p>

      <button>I am a normal button</button>

      <button className="btn btn-primary">I am a DaisyUI button</button>
    </main>
  )
}
