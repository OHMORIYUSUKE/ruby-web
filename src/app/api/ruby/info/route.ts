import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/node";
import { RbError } from "@ruby/wasm-wasi";

export const GET = async () => {
  const binary = await fs.readFile(
    process.cwd() + "/node_modules/@ruby/3.3-wasm-wasi/dist/ruby.wasm"
  );
  const modules = await WebAssembly.compile(binary);
  const { vm } = await DefaultRubyVM(modules);
  vm.eval(`
      require "stringio"
      $stdout = $stderr = StringIO.new(+"", "w")
    `);
  vm.eval(`
    def ruby_info
      puts "実行環境"
      puts "Ruby バージョン: #{RUBY_VERSION}"
      puts "Ruby 詳細: #{RUBY_DESCRIPTION}"
      puts "Ruby パッチレベル: #{RUBY_PATCHLEVEL}" if defined?(RUBY_PATCHLEVEL)
      puts "Ruby プラットフォーム: #{RUBY_PLATFORM}"
      puts "Ruby 実装: #{RUBY_ENGINE}" if defined?(RUBY_ENGINE)
    end
    ruby_info
  `);
  const output = vm.eval(`$stdout.string`).toString();
  return NextResponse.json(output, { status: 500 });
};
