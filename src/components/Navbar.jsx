function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-6 border-b border-slate-800">
      <h1 className="text-3xl font-bold text-cyan-400">
        PlacementPilot AI
      </h1>

      <div className="space-x-6">
        <button className="text-gray-300 hover:text-cyan-400">
          Features
        </button>

        <button className="text-gray-300 hover:text-cyan-400">
          About
        </button>

        <button className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-xl font-semibold">
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default Navbar;