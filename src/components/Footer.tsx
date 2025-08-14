export default function Footer() {
  return (
    <footer className="bg-[#121212] text-[#AAAAAA] px-8 py-8 mt-10">
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="w-6 h-6" alt="logo" />
          <span>© 2025 VibeCheck. All rights reserved.</span>
        </div>
        <div className="text-sm">
          VibeCheck matches your daily mood with music and quotes. Contact:{" "}
          <a
            href="mailto:support@vibecheck.app"
            className="hover:text-yellow-400"
          >
            support@vibecheck.app
          </a>
        </div>
        <div className="flex items-center gap-4 justify-start sm:justify-end">
          <a href="#" className="hover:text-yellow-400">
            Instagram
          </a>
          <a href="#" className="hover:text-yellow-400">
            Twitter
          </a>
          <a href="#" className="hover:text-yellow-400">
            LinkedIn
          </a>
          <a href="#" className="hover:text-yellow-400">
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
