# Bibi

`bibi` is my personal repository/Project management tool. It supports getting one or all repositories from github, syncing them and executing commands in them with ease.

## Installation

```
npm install -g bibi
# bibi --help
```

## Usage

```
# To get one repo
bibi get steelbrain/linter
# To get all repos of a user
bibi get-all steelbrain
# To execute a command in all repos by a user
bibi exec --scope "steelbrain/*" -- pwd
# To sync all repos
bibi sync --scope "*"
# To sync specific repos
bibi sync --scope "steelbrain/linter*"
```

## License

This package is licensed under the terms of MIT License. See the LICENSE file for more info.
