"use client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

export default function Home() {
  const [code, setCode] = useState(`user_input = gets.chomp
output_message = user_input + " Ruby !"
puts output_message
`);
  const [input, setInput] = useState("Hello");
  const [result, setResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/ruby/execute", { code, input });
      setErrorMessage("");
      setResult(response.data);
    } catch (error) {
      setResult("");
      if (axios.isAxiosError(error)) {
        setErrorMessage((error as AxiosError).response?.data as string);
      } else {
        setErrorMessage("ネットワークで問題が発生しました。");
      }
    }
  };

  const [vmInfo, setVmInfo] = useState("");

  useEffect(() => {
    // GETリクエストを送信する関数
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ruby/info");
        const result = await response.json();
        setVmInfo(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ margin: "0 auto", width: "50%" }}>
      <div style={{ textAlign: "center" }}>
        <code style={{ fontSize: "large" }}>💎 Ruby Playground</code>
      </div>
      <br />
      <code>コード</code>
      <CodeEditor
        value={code}
        language="rb"
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      <br />
      <code>標準入力</code>
      <CodeEditor
        value={input}
        language="rb"
        onChange={(evn) => setInput(evn.target.value)}
        padding={15}
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      <br />
      <div style={{ textAlign: "center" }}>
        <button style={{ width: "50%" }} onClick={handleSubmit}>
          実行
        </button>
      </div>
      <br />
      {result !== "" ? (
        <CodeEditor
          value={result}
          padding={15}
          readOnly={true}
          style={{
            backgroundColor: "#000",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            color: "white",
          }}
        />
      ) : (
        <></>
      )}
      {errorMessage !== "" ? (
        <CodeEditor
          value={errorMessage}
          padding={15}
          readOnly={true}
          style={{
            backgroundColor: "#000",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            color: "red",
          }}
        />
      ) : (
        <></>
      )}
      <div style={{ position: "fixed", bottom: 0, width: "50%" }}>
        <CodeEditor
          value={vmInfo}
          language="rb"
          readOnly={true}
          padding={15}
          style={{
            backgroundColor: "#f5f5f5",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            whiteSpace: "pre-wrap",
          }}
        />
      </div>
    </div>
  );
}
