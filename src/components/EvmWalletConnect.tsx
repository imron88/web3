import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Wallet } from 'lucide-react';

interface EthereumProvider {
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
}

interface WindowWithEthereum extends Window {
  ethereum?: EthereumProvider;
}

export const EvmWalletConnect: React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);

  useEffect(() => {
    const win = window as WindowWithEthereum;
    if (typeof window !== 'undefined' && win.ethereum) {
      const p = new ethers.BrowserProvider(win.ethereum);
      setProvider(p);

      // detect accounts if already connected
      p.send('eth_accounts', [])
        .then((accounts: unknown) => {
          const accountList = accounts as string[];
          if (accountList && accountList.length) setAccount(ethers.getAddress(accountList[0]));
        })
        .catch(() => {});

      // get chain id
      p.getNetwork().then((n) => setChainId(n.chainId)).catch(() => {});

      // listeners
      const handleAccountsChanged = (accounts: unknown) => {
        const accountList = accounts as string[];
        if (accountList && accountList.length) setAccount(ethers.getAddress(accountList[0]));
        else setAccount(null);
      };

      const handleChainChanged = (chain: unknown) => {
        try {
          // MetaMask returns hex string like '0x1'
          const chainStr = String(chain);
          const parsed = BigInt(chainStr);
          setChainId(parsed);
        } catch {
          setChainId(null);
        }
      };

      win.ethereum.on?.('accountsChanged', handleAccountsChanged);
      win.ethereum.on?.('chainChanged', handleChainChanged);

      return () => {
        win.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
        win.ethereum?.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connectMetaMask = async () => {
    if (!provider) {
      window.open('https://metamask.io/', '_blank');
      return;
    }

    try {
      const accounts = await (provider as ethers.BrowserProvider).send('eth_requestAccounts', []) as string[];
      if (accounts && accounts.length) setAccount(ethers.getAddress(accounts[0]));
      const net = await provider.getNetwork();
      setChainId(net.chainId);
    } catch (err) {
      console.error('MetaMask connect error', err);
    }
  };

  const disconnect = () => {
    // MetaMask does not support programmatic disconnect; we simply clear UI state
    setAccount(null);
  };

  return (
    <div className="flex items-center space-x-4">
      {account && (
        <div className="flex items-center bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg">
          <Wallet className="h-4 w-4 mr-2" />
          <span className="text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
          {chainId !== null && <span className="ml-2 text-xs text-yellow-700">(net {String(chainId)})</span>}
        </div>
      )}
      <button
        onClick={() => (account ? disconnect() : connectMetaMask())}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
          account ? 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100' : 'bg-yellow-600 text-white hover:bg-yellow-700'
        }`}
      >
        <Wallet className="h-4 w-4 mr-2" />
        {account ? 'Disconnect MetaMask' : 'Connect MetaMask'}
      </button>
    </div>
  );
};
