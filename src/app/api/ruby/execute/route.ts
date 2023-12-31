import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/node";
import { RbError } from "@ruby/wasm-wasi";

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const binary = await fs.readFile(process.cwd() + "/src/app/wasm/ruby.wasm");
  const modules = await WebAssembly.compile(binary);
  const { vm } = await DefaultRubyVM(modules);

  try {
    // 通常コンソールに出力する内容をメモリ上の文字列に書き込む
    vm.eval(`
      require "stringio"
      $stdout = $stderr = StringIO.new(+"", "w")
    `);

    // ユーザーからの標準入力テキスト
    const inputString = body.input;

    // ユーザーからのコードテキスト
    const rubyCode = body.code;

    // ユーザーからの標準入力テキストをrubyに渡す
    vm.eval(`
      require "stringio"
      $stdin = StringIO.new("${inputString}")
    `);
    // 実行
    vm.eval(rubyCode);
    // メモリ上の標準出力を取得
    const output = vm.eval(`$stdout.string`).toString();

    console.log("Ruby VM Result:", output);

    return NextResponse.json(output, { status: 200 });
  } catch (e) {
    console.log("Ruby VM Result:", (e as RbError).toString());
    return NextResponse.json((e as RbError).toString(), { status: 500 });
  }
};
