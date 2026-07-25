import { useState } from "react";

function Interview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);

  const generateQuestions = async () => {
    const response = await fetch("http://127.0.0.1:8000/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
      }),
    });

    const data = await response.json();
    setQuestions(data.questions);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Interview Generator</h1>

      <input
        type="text"
        placeholder="Enter Job Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={generateQuestions}>
        Generate Questions
      </button>

      <h2>Interview Questions</h2>

      <ul>
        {questions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
}

export default Interview;