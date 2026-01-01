'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { vaultIdl } from './idl';

const PROGRAM_ID = new PublicKey("2669p3Q1tSrw1wGVJPs6w6nn8CxWmhdSWSHN5D7Fhgbu");

export default function Home() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [vaultBalance, setVaultBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const getVaultPDA = useCallback((user: PublicKey) => {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), user.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  }, []);

  const fetchBalances = useCallback(async () => {
    if (publicKey) {
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);

        const vaultPDA = getVaultPDA(publicKey);
        const vBal = await connection.getBalance(vaultPDA);
        setVaultBalance(vBal / LAMPORTS_PER_SOL);
      } catch (err) {
        console.error("Error fetching balances:", err);
        if (vaultBalance === null) setVaultBalance(0);
      }
    }
  }, [publicKey, connection, getVaultPDA, vaultBalance]);

  useEffect(() => {
    if (publicKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchBalances();
    }
  }, [publicKey, fetchBalances]);

  const program = useMemo(() => {
    if (!anchorWallet) return null;
    const provider = new anchor.AnchorProvider(connection, anchorWallet, { commitment: 'confirmed' });
    return new anchor.Program(vaultIdl as unknown as anchor.Idl, provider);
  }, [connection, anchorWallet]);

  const handleAction = async (action: 'deposit' | 'withdraw') => {
    if (!publicKey || !amount || !program) return;
    setStatus(`Processing ${action}...`);
    try {
      const vaultPDA = getVaultPDA(publicKey);
      const lamports = new anchor.BN(parseFloat(amount) * LAMPORTS_PER_SOL);

      const methods = program.methods as unknown as Record<string, (amount: anchor.BN) => { 
        accounts: (accs: Record<string, PublicKey>) => { rpc: () => Promise<string> } 
      }>;
      const tx = await methods[action](lamports)
        .accounts({
          user: publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus(`${action.charAt(0).toUpperCase() + action.slice(1)} successful! TX: ${tx}`);
      await fetchBalances();
    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setStatus(`${action.charAt(0).toUpperCase() + action.slice(1)} failed: ${errorMessage}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          Solana Vault
        </h1>
        
        <div className="flex justify-center mb-8">
          <WalletMultiButton />
        </div>

        {publicKey ? (
          <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-800">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs uppercase">Your Balance</p>
                <p className="text-xl font-bold text-blue-400">{balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase">Vault Balance</p>
                <p className="text-xl font-bold text-green-400">{vaultBalance !== null ? `${vaultBalance.toFixed(4)} SOL` : 'Loading...'}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-xs uppercase mb-2">Amount (SOL)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="0.1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAction('deposit')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg shadow-blue-900/20"
              >
                Deposit
              </button>
              <button
                onClick={() => handleAction('withdraw')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg shadow-green-900/20"
              >
                Withdraw
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Please connect your wallet to interact with the vault.
          </div>
        )}

        {status && (
          <div className="mt-8 p-4 rounded-lg bg-gray-900 text-xs break-all max-w-2xl mx-auto border border-gray-800">
            <p className={status.includes("failed") ? "text-red-400" : "text-blue-400"}>{status}</p>
          </div>
        )}

        <div className="mt-12 text-center text-gray-600 text-[10px] uppercase tracking-widest">
          <p>Program ID: {PROGRAM_ID.toString()}</p>
          <p className="mt-2">Built with Anchor & Next.js</p>
        </div>
      </div>
    </main>
  );
}
