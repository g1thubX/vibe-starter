# Solana Vault DApp

这是一个包含 Solana Anchor 程序和 Next.js 前端的完整示例。

## 项目结构

- `vault-app/`: 存款程序 (Anchor)
- `withdraw-app/`: 取款程序 (Anchor)
- `app/`: Next.js 前端页面

## 快速开始

### 1. 环境准备
确保已安装 Rust, Solana CLI 和 Anchor。

### 2. 启动本地验证节点
在独立终端运行：
```bash
solana-test-validator
```

### 3. 部署程序
进入 `vault-app` 或 `withdraw-app` 目录并部署：
```bash
cd vault-app
anchor build
anchor deploy
```
*(注意：两个程序已配置为使用相同的 Program ID 以共享同一个保险库账户)*

### 4. 启动前端
在项目根目录下运行：
```bash
npm install
npm run dev
```

### 5. 使用前端验证功能
1. 打开 [http://localhost:3000](http://localhost:3000)。
2. 连接您的 Solana 钱包（确保切换到 Localnet）。
3. 输入金额并点击 **Deposit** 存入 SOL。
4. 观察页面上的 Vault Balance 增加。
5. 输入金额并点击 **Withdraw** 提取 SOL。
6. 观察页面上的 Vault Balance 减少。

## 详细指南
- [存款程序指南](./vault-app/README.md)
- [取款程序指南](./withdraw-app/README.md)
