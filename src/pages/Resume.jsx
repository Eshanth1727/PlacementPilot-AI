import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function Resume() {
  const [fileName, setFileName] = useState("");
  const [role, setRole] = useState("");
  const [resumeText, setResumeText] = useState("");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});

  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFileName(file.name);

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      text +=
        content.items.map((item) => item.str).join(" ") + "\n";
    }

    setResumeText(text);
  };

  const generateQuestions = async () => {
    if (!role) {
      alert("Enter Job Role");
      return;
    }

    if (!resumeText) {
      alert("Upload Resume");
      return;
    }

    setLoading(true);

   const response = await fetch(
   "https://placementpilot-ai-production.up.railway.app/generate-questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          resume: resumeText,
        }),
      }
    );

    const data = await response.json();

    setQuestions(data.questions || []);

    setLoading(false);
  };

  const evaluateAnswer = async (question) => {
   const response = await fetch(
   "https://placementpilot-ai-production.up.railway.app/evaluate-answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          question,
          answer: answers[question] || "",
        }),
      }
    );

    const data = await response.json();

    setEvaluations((prev) => ({
      ...prev,
      [question]: data.evaluation,
    }));
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

    <div className="max-w-6xl mx-auto mt-8 p-10 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-slate-700 shadow-[0_0_40px_rgba(6,182,212,0.15)]">

        <h1 className="text-5xl font-extrabold bg-gradient-to-r
        from-cyan-400 via-blue-500 to-purple-500
         bg-clip-text text-transparent">
              PlacementPilot AI
        </h1>

        <p className="text-gray-300 mt-2">
          AI Powered Resume Based Mock Interview
        </p>

        <input
          type="text"
          placeholder="Enter Job Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-6 w-full rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-gray-400 p-4 focus:ring-2 focus:ring-cyan-500 outline-none"
        />

        <label className="mt-4 flex h-40 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500 bg-slate-800 hover:bg-slate-700 transition">
    <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
    />

    <div className="text-center">
        <p className="text-xl font-semibold">
            Upload Resume
        </p>

        <p className="text-gray-400">
            PDF only
        </p>
    </div>
</label>

        <button
          onClick={generateQuestions}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 duration-300 shadow-xl">
          {loading ? "Generating..." : "Generate Interview Questions"}
        </button>

        {questions.length > 0 && (
          <div className="mt-10">

            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Interview Questions
            </h2>

            {questions.map((question, index) => (
              <div
                key={index}
                className="mb-8 p-5 rounded-xl bg-slate-800"
              >

                <h3 className="font-bold text-lg">
                  Question {index + 1}
                </h3>

                <p className="mt-2">{question}</p>

                <textarea
                  rows="5"
                  placeholder="Type your answer..."
                  className="w-full mt-4 p-3 rounded-lg bg-slate-900"
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [question]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => evaluateAnswer(question)}
                  className="mt-4 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
                >
                  Evaluate Answer
                </button>

                {evaluations[question] && (
                  <div className="mt-4 whitespace-pre-wrap bg-slate-900 p-4 rounded-lg border border-cyan-500">
                    {evaluations[question]}
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Resume;