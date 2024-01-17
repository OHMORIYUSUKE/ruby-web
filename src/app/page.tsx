import { redirect } from "next/navigation";
import fs from "fs/promises";
import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/node";
import { RbError } from "@ruby/wasm-wasi";

export default function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const output = searchParams.output;
  const exitCode = searchParams.exit_code;

  const example = {
    code: `user_input = gets.chomp

greeting = "Hello #{user_input}"
  
puts greeting
  `,
    input: "World !",
  };

  const runCode = async (formData: FormData) => {
    "use server";

    let result = "";
    let exitCode = 0;

    const binary = await fs.readFile(
      process.cwd() + "/node_modules/@ruby/3.3-wasm-wasi/dist/ruby.wasm"
    );
    const modules = await WebAssembly.compile(binary);
    const { vm } = await DefaultRubyVM(modules);

    try {
      // 通常コンソールに出力する内容をメモリ上の文字列に書き込む
      vm.eval(`
        require "stringio"
        $stdout = $stderr = StringIO.new(+"", "w")
      `);

      // ユーザーからの標準入力テキスト
      const input = formData.get("input");

      // ユーザーからのコードテキスト
      const code = formData.get("code") as string;

      // ユーザーからの標準入力テキストをrubyに渡す
      vm.eval(`
        require "stringio"
        $stdin = StringIO.new("${input}")
      `);
      // 実行
      vm.eval(code);
      // メモリ上の標準出力を取得
      const output = vm.eval(`$stdout.string`).toString();

      console.log("Ruby VM Result:" + output);
      result = output;
    } catch (e) {
      console.log("Ruby VM Result:", (e as RbError).toString());
      result = (e as RbError).toString();
      exitCode = 1;
    }
    redirect(
      `/?output=${encodeURIComponent(result)}&exit_code=${encodeURIComponent(
        exitCode
      )}`
    );
  };

  return (
    <>
      <div style={{ margin: "0 auto", width: "50%" }}>
        <div style={{ textAlign: "center" }}>
          <code style={{ fontSize: "large" }}>💎 Ruby Playground</code>
        </div>
        <br />
        <form action={runCode}>
          <code>コード</code>
          <br />
          <textarea
            name="code"
            rows={10}
            cols={70}
            defaultValue={example.code}
            style={{ width: "100%" }}
          ></textarea>
          <br />
          <code>標準入力</code>
          <br />
          <textarea
            name="input"
            rows={3}
            cols={70}
            defaultValue={example.input}
            style={{ width: "100%" }}
          ></textarea>
          <br />
          <div style={{ textAlign: "center" }}>
            <input
              style={{ width: "50%", marginTop: "10px" }}
              id="submit"
              type="submit"
              value="実行"
            />
          </div>
        </form>
        <br />
        <div
          style={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            width: "100%",
            backgroundColor: "black",
            padding: "10px",
          }}
        >
          {Number(exitCode) === 0 ? (
            <code style={{ color: "white" }}>{output}</code>
          ) : (
            <code style={{ color: "red" }}>{output}</code>
          )}
        </div>
      </div>
    </>
  );
}
