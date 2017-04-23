# SB CLI

`sb-cli` is my personal repository/Project management tool. It supports getting one or all repositories from github, syncing them and executing commands in them with ease.

## Installation

```
npm install -g sb-cli
# sb-cli --help
```

## Usage

```
# To get one repo
sb-cli get steelbrain/linter
# To get all repos of a user
sb-cli get-all steelbrain
# To execute a command in all repos by a user
sb-cli exec --scope "steelbrain/*" -- pwd
# To sync all repos
sb-cli sync --scope "*"
# To sync specific repos
sb-cli sync --scope "steelbrain/linter*"
```

## License

This package is licensed under the terms of MIT License. See the LICENSE file for more info.
