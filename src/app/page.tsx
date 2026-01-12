export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          🏗️ Conecta Obras
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Plataforma de mapeamento de obras para geração de leads
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Começar
          </button>
          <button className="border border-input bg-background px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors">
            Saiba mais
          </button>
        </div>
      </div>
    </main>
  )
}
