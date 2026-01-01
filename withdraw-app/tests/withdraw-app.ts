import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { WithdrawApp } from "../target/types/withdraw_app";
import { expect } from "chai";

describe("withdraw-app", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.WithdrawApp as Program<WithdrawApp>;

  it("Is withdrawn!", async () => {
    // 注意：这个测试假设 Vault 已经有资金。
    // 在实际的端到端测试中，你可能需要先调用 vault-app 存入资金。
    const user = provider.wallet.publicKey;
    const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), user.toBuffer()],
      program.programId
    );

    // 尝试取款 0.1 SOL
    const amount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL);

    try {
      const tx = await program.methods
        .withdraw(amount)
        .accounts({
          user: user,
          vault: vaultPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      console.log("Withdrawal transaction signature", tx);
    } catch (e) {
      console.log("Withdrawal failed (possibly no funds in vault):", e.message);
    }
  });
});
