import { CreateTokenForm } from './create-token-form'

export function CreateTokenSection() {
  return (
    <section className="bg-gradient-to-b from-purple-600 to-blue-600 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Create Your Token
          </h2>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Fill out the form below to create your custom meme token. No coding
            required - just configure your preferences and launch!
          </p>
        </div>
        <CreateTokenForm />
      </div>
    </section>
  )
}
