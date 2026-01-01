# Withdraw App (取款程序)

这是一个基于 Anchor 框架开发的 Solana 程序，允许保险库的所有者从他们的保险库（Vault）中提取 SOL。

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

### 2. 配置程序 ID
确保 `programs/withdraw-app/src/lib.rs` 中的 `declare_id!` 和 `Anchor.toml` 中的程序 ID 匹配。

### 3. 构建程序
```bash
anchor build
```

### 4. 部署程序
确保您的本地验证节点正在运行（执行 `solana-test-validator`）：
```bash
anchor deploy
```

## 程序功能使用说明

### 取款 (Withdraw)
该程序提供了一个 `withdraw` 指令，接受一个 `amount` 参数（单位为 lamports）。

- **权限控制**: 只有保险库的所有者（Signer）可以发起取款。
- **账户验证**: 程序会验证传入的 `vault` 账户是否是由正确的种子（`[b"vault", user_pubkey]`）派生的。
- **资金检查**: 程序会检查保险库余额是否充足（扣除租金豁免额度后的余额）。

### 开发者测试
执行测试脚本以验证取款功能：
```bash
anchor test
```

## 注意事项
该程序假设保险库账户已经由 `vault-app` 或其他方式创建并存入资金。如果保险库不存在，取款指令将会失败。
