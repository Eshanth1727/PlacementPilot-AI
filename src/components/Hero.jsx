function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center mt-32 px-6">
      <h1 className="text-6xl font-extrabold leading-tight">
        Your AI Powered
        <br />
        Interview Coach
      </h1>

      <p className="text-gray-400 text-xl mt-6 max-w-2xl">
        Practice interviews, analyze your resume, receive personalized
        feedback, and improve with AI-generated learning roadmaps.
      </p>

      <div className="mt-10 flex gap-5">
        <button className="bg-cyan-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-cyan-600">
          Start Interview
        </button>

        <button className="border border-cyan-500 px-8 py-4 rounded-xl text-lg hover:bg-cyan-500 hover:text-white">
          Upload Resume
        </button>
      </div>
    </section>
  );
}

export default Hero;