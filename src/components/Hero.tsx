export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20" />

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-200">✨ Welcome to CodePilot</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Your AI-Powered{' '}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Development Assistant
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Code faster, smarter, and with confidence. Let CodePilot handle the repetitive tasks while you focus on building amazing features.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary">
            Get Started Free
          </button>
          <button className="btn-secondary">
            Watch Demo
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Trusted by developers worldwide</p>
          <div className="flex justify-center gap-8 flex-wrap">
            {['10K+ Users', '99.9% Uptime', '24/7 Support', '100% Secure'].map((item) => (
              <div key={item} className="text-sm font-medium text-slate-900 dark:text-white">
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
