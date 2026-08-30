import { LanguageDropdown } from './components/LanguageDropdown'
import { Hero } from './sections/Hero'

function App() {
  return (
    <main className="relative min-h-screen bg-bg text-ink font-sans">
      <div className="fixed top-6 right-6 z-50">
        <LanguageDropdown />
      </div>
      <Hero />
    </main>
  )
}

export default App