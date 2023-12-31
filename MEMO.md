```sh
curl -X POST -H "Content-Type: application/json" -d '{"code": "def ruby_info; puts \"Ruby バージョン: #{RUBY_VERSION}\"; puts \"Ruby 詳細: #{RUBY_DESCRIPTION}\"; puts \"Ruby パッチレベル: #{RUBY_PATCHLEVEL}\" if defined?(RUBY_PATCHLEVEL); puts \"Ruby プラットフォーム: #{RUBY_PLATFORM}\"; puts \"Ruby 実装: #{RUBY_ENGINE}\" if defined?(RUBY_ENGINE); end; puts ruby_info; while line = gets; puts line.chomp; puts \"=====\"; end", "input": "a\nb\nc"}' http://localhost:3000/api/ruby/execute
```
