export default function NewsletterSection() {
  return (
    <section className="py-24 bg-neutral-900 text-white text-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-light mb-4 tracking-tight">
          Join the Inner Circle
        </h2>
        <p className="text-[14px] text-neutral-400 mb-10 font-light">
          Receive exclusive access to new architectural acquisitions, editorial
          content, and private collections.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Email Address"
            className="flex-1 bg-transparent border-b border-neutral-700 text-white placeholder-neutral-500 py-3 px-2 focus:outline-none focus:border-white transition-colors rounded-none text-[13px]"
            required
          />
          <button
            type="submit"
            className="bg-white text-neutral-950 px-8 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
