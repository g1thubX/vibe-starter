import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultApp } from "../target/types/vault_app";
import { expect } from "chai";

describe("vault-app", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VaultApp as Program<VaultApp>;

  it("Is deposited!", async () => {
    const user = provider.wallet.publicKey;
    const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), user.toBuffer()],
      program.programId
    );

    const amount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods
      .deposit(amount)
      .accounts({
        user: user,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    const vaultBalance = await provider.connection.getBalance(vaultPDA);
    expect(vaultBalance).to.be.at.least(amount.toNumber());
  });
});
