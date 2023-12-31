"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/ruby/execute", { code, input });

      setResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResult((error as AxiosError).response?.data as string);
      } else {
        setResult("An error occurred while processing your request.");
      }
    }
  };

  return (
    <div>
      <label>
        Code:
        <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      </label>
      <br />
      <label>
        Input:
        <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <code>{JSON.stringify(result)}</code>
    </div>
  );
}
