# Vault App (存款程序)

这是一个基于 Anchor 框架开发的 Solana 程序，允许用户将 SOL 存入他们自己的保险库（Vault）。

## 环境准备

在开始之前，请确保您的开发环境已安装以下工具：

1. **Rust**: [安装指南](https://www.rust-lang.org/tools/install)
2. **Solana CLI**: [安装指南](https://docs.solana.com/cli/install-solana-cli-tools)
3. **Anchor Framework**: [安装指南](https://www.anchor-lang.com/docs/installation)

## 快速开始

### 1. 配置 Solana 集群
确保您正在使用本地测试网或开发网：
```bash
solana config set --url localhost
```

### 2. 生成程序 ID
如果您需要重新生成程序 ID，可以运行：
```bash
anchor keys list
```
并将输出的 ID 替换到 `programs/vault-app/src/lib.rs` 的 `declare_id!` 宏以及 `Anchor.toml` 中的 `[programs.localnet]` 部分。

### 3. 构建程序
```bash
anchor build
```

### 4. 部署程序
确保您的本地验证节点正在运行（在另一个终端执行 `solana-test-validator`）：
```bash
anchor deploy
```

## 程序功能使用说明

### 存款 (Deposit)
该程序提供了一个 `deposit` 指令，接受一个 `amount` 参数（单位为 lamports）。

- **Vault 账户**: 程序会自动为每个用户创建一个派生账户（PDA），其种子为 `[b"vault", user_pubkey]`。
- **自动初始化**: 如果用户的保险库尚未创建，程序会在第一次存款时自动初始化它（使用了 `init_if_needed`）。

### 开发者测试
您可以编写测试脚本来验证功能，或者参考 `tests/` 目录下的测试用例。执行测试：
```bash
anchor test
```
