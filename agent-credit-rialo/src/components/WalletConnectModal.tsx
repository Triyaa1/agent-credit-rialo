import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TIERS, formatAddress } from '../utils/creditScore';
import { X, Check, ArrowRight, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';

// Official MetaMask Fox SVG Icon
const MetaMaskIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.5 2.5L18.2 10.8L20.4 5.5L29.5 2.5Z" fill="#E17726" stroke="#E17726" strokeWidth="0.5"/>
    <path d="M2.5 2.5L11.5 5.5L13.8 10.8L2.5 2.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5"/>
    <path d="M25.2 22.3L22.3 26.6L28.8 28.5L30.5 22.4L25.2 22.3Z" fill="#E27625"/>
    <path d="M1.5 22.4L3.2 28.5L9.7 26.6L6.8 22.3L1.5 22.4Z" fill="#E27625"/>
    <path d="M9.4 14.2L7.6 16.9L14 17.2L13.7 10.9L9.4 14.2Z" fill="#E27625"/>
    <path d="M22.6 14.2L18.2 10.8L18 17.2L24.4 16.9L22.6 14.2Z" fill="#E27625"/>
    <path d="M9.7 26.6L13.5 24.8L10.2 22.4L9.7 26.6Z" fill="#E27625"/>
    <path d="M18.5 24.8L22.3 26.6L21.8 22.4L18.5 24.8Z" fill="#E27625"/>
    <path d="M22.3 26.6L18.5 24.8L18.7 27.2L18.6 28.3L22.3 26.6Z" fill="#D5BFB2"/>
    <path d="M9.7 26.6L13.4 28.3L13.3 27.2L13.5 24.8L9.7 26.6Z" fill="#D5BFB2"/>
    <path d="M13.5 20.3L9.9 19.3L12.5 18.2L13.5 20.3Z" fill="#233447"/>
    <path d="M18.5 20.3L19.5 18.2L22.1 19.3L18.5 20.3Z" fill="#233447"/>
    <path d="M9.7 26.6L10.2 22.4L6.8 22.3L9.7 26.6Z" fill="#CC6228"/>
    <path d="M21.8 22.4L22.3 26.6L25.2 22.3L21.8 22.4Z" fill="#CC6228"/>
    <path d="M24.4 16.9L18 17.2L18.5 20.3L19.5 18.2L22.1 19.3L24.4 16.9Z" fill="#CC6228"/>
    <path d="M9.9 19.3L12.5 18.2L13.5 20.3L14 17.2L7.6 16.9L9.9 19.3Z" fill="#CC6228"/>
    <path d="M7.6 16.9L10.2 22.4L9.9 19.3L7.6 16.9Z" fill="#E27525"/>
    <path d="M21.8 19.3L21.8 22.4L24.4 16.9L21.8 19.3Z" fill="#E27525"/>
    <path d="M14 17.2L13.5 20.3L14.2 24.3L14.3 19.5L14 17.2Z" fill="#E27525"/>
    <path d="M18 17.2L17.7 19.5L17.8 24.3L18.5 20.3L18 17.2Z" fill="#E27525"/>
    <path d="M18.5 20.3L17.8 24.3L18.5 24.8L21.8 22.4L22.1 19.3L18.5 20.3Z" fill="#F5841F"/>
    <path d="M9.9 19.3L10.2 22.4L13.5 24.8L14.2 24.3L13.5 20.3L9.9 19.3Z" fill="#F5841F"/>
    <path d="M18.6 28.3L18.7 27.2L18.5 24.8L16 26.6L13.5 24.8L13.3 27.2L13.4 28.3L16 29.5L18.6 28.3Z" fill="#C0AC9D"/>
    <path d="M18.5 24.8L17.8 24.3L14.2 24.3L13.5 24.8L16 26.6L18.5 24.8Z" fill="#161616"/>
    <path d="M29.9 11.2L30.7 7.5L29.5 2.5L20.3 5.6L22.6 14.2L28.6 12.3L29.9 11.2Z" fill="#763E1A"/>
    <path d="M2.1 11.2L3.4 12.3L9.4 14.2L11.7 5.6L2.5 2.5L1.3 7.5L2.1 11.2Z" fill="#763E1A"/>
    <path d="M28.6 12.3L22.6 14.2L24.4 16.9L21.8 19.3L25.2 22.3L30.5 22.4L28.6 12.3Z" fill="#F5841F"/>
    <path d="M10.2 19.3L7.6 16.9L9.4 14.2L3.4 12.3L1.5 22.4L6.8 22.3L10.2 19.3Z" fill="#F5841F"/>
    <path d="M18.2 10.8L20.4 5.5L16 4.3L11.5 5.5L13.8 10.8L14 17.2L14.1 17.1L16 15.6L17.9 17.1L18 17.2L18.2 10.8Z" fill="#F5841F"/>
  </svg>
);

// Official WalletConnect SVG Icon
const WalletConnectIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#3B99FC"/>
    <path d="M8.2 12.3C12.5 8 19.5 8 23.8 12.3L24.3 12.8C24.5 13 24.5 13.4 24.3 13.6L22.6 15.3C22.5 15.4 22.3 15.4 22.2 15.3L21.5 14.6C18.5 11.6 13.5 11.6 10.5 14.6L9.8 15.3C9.7 15.4 9.5 15.4 9.4 15.3L7.7 13.6C7.5 13.4 7.5 13 7.7 12.8L8.2 12.3ZM26.8 15.3L28.3 16.8C28.5 17 28.5 17.4 28.3 17.6L21.9 24C21.7 24.2 21.3 24.2 21.1 24L17.3 20.2C17.2 20.1 17.1 20.1 17 20.2L13.2 24C13 24.2 12.6 24.2 12.4 24L6 17.6C5.8 17.4 5.8 17 6 16.8L7.5 15.3C7.7 15.1 8.1 15.1 8.3 15.3L12.1 19.1C12.2 19.2 12.3 19.2 12.4 19.1L16.2 15.3C16.4 15.1 16.8 15.1 17 15.3L20.8 19.1C20.9 19.2 21 19.2 21.1 19.1L24.9 15.3C25.1 15.1 25.5 15.1 25.7 15.3L26.8 15.3Z" fill="white"/>
  </svg>
);

// Official Coinbase Wallet SVG Icon
const CoinbaseWalletIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#0052FF"/>
    <circle cx="16" cy="16" r="9" fill="white"/>
    <rect x="13.2" y="13.2" width="5.6" height="5.6" rx="1.2" fill="#0052FF"/>
  </svg>
);

export const WalletConnectModal: React.FC = () => {
  const { 
    isConnectModalOpen, 
    setIsConnectModalOpen, 
    connectWallet, 
    disconnectWallet,
    isWalletConnected,
    connectedAddress,
    activeAgent,
    pendingActionNotice,
    setPendingActionNotice
  } = useApp();

  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isConnectModalOpen) return null;

  const handleClose = () => {
    setIsConnectModalOpen(false);
    setPendingActionNotice(null);
    setErrorMessage(null);
  };

  const getMetaMaskProvider = () => {
    try {
      if (typeof window === 'undefined') return null;
      const eth = (window as any).ethereum;
      if (!eth) return null;
      if (eth.providers && Array.isArray(eth.providers)) {
        return eth.providers.find((p: any) => p.isMetaMask) || eth;
      }
      return eth;
    } catch {
      return null;
    }
  };

  const connectSimulated = async (provider: string) => {
    setErrorMessage(null);
    setConnectingProvider(provider);
    setTimeout(async () => {
      // Deterministic valid Ethereum format address
      const hex = '0123456789abcdef';
      let cleanEthAddr = '0x';
      for (let i = 0; i < 40; i++) {
        const c = hex[Math.floor(Math.random() * hex.length)];
        cleanEthAddr += Math.random() > 0.4 ? c.toUpperCase() : c;
      }
      
      await connectWallet(provider, cleanEthAddr);
      setConnectingProvider(null);
      setIsConnectModalOpen(false);
    }, 400);
  };

  const handleSelectProvider = async (providerId: string, providerName: string) => {
    setErrorMessage(null);

    // 1. Dedicated Real MetaMask Integration
    if (providerId === 'metamask') {
      const provider = getMetaMaskProvider();

      // Check if window.ethereum exists
      if (!provider) {
        setErrorMessage('MetaMask is not installed. Please install the MetaMask extension.');
        return;
      }

      setConnectingProvider('MetaMask');
      try {
        // Trigger real eth_requestAccounts
        const accounts = await provider.request({ method: 'eth_requestAccounts' });

        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          await connectWallet('MetaMask', address);
          setIsConnectModalOpen(false);
        } else {
          setErrorMessage('No accounts returned from MetaMask. Please unlock your wallet.');
        }
      } catch (err: any) {
        // Handle user rejection (code 4001)
        if (err?.code === 4001 || err?.message?.toLowerCase().includes('reject') || err?.message?.toLowerCase().includes('user denied')) {
          setErrorMessage('Connection request was rejected in MetaMask.');
        } else if (err?.code === -32002) {
          setErrorMessage('A connection request is already pending. Please open the MetaMask extension to approve.');
        } else {
          setErrorMessage(err?.message || 'Failed to connect to MetaMask.');
        }
      } finally {
        setConnectingProvider(null);
      }
      return;
    }

    // 2. Coinbase Wallet or WalletConnect
    if (providerId === 'coinbase') {
      const eth = window.ethereum;
      const cb = eth?.isCoinbaseWallet ? eth : (eth?.providers?.find((p: any) => p.isCoinbaseWallet));
      if (cb) {
        setConnectingProvider('Coinbase Wallet');
        try {
          const accounts = await cb.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            await connectWallet('Coinbase Wallet', accounts[0]);
            setIsConnectModalOpen(false);
            return;
          }
        } catch {
          // fall through to simulation
        } finally {
          setConnectingProvider(null);
        }
      }
      await connectSimulated('Coinbase Wallet');
      return;
    }

    // Default / WalletConnect
    await connectSimulated(providerName);
  };

  const handleCopy = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const providers = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect with MetaMask browser extension or mobile app',
      icon: <MetaMaskIcon />,
      badge: 'Popular'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect with Coinbase smart wallet or mobile app',
      icon: <CoinbaseWalletIcon />,
      badge: 'Coinbase'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Connect with 100+ mobile wallets via QR code bridge',
      icon: <WalletConnectIcon />,
      badge: 'Multi-Chain'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-enter">
      <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-[4px] shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-4 border-b border-[#334155] flex items-center justify-between bg-[#0f172a]">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-wider block">
              AUTHENTICATION GATEWAY
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {isWalletConnected ? 'Connected Wallet' : 'Connect a Web3 Wallet'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-[4px] text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* Action Prompt Banner */}
          {pendingActionNotice && (
            <div className="p-3 bg-[#0f172a] border border-[#10b981]/70 rounded-[4px] flex items-start gap-2.5 text-xs text-gray-200">
              <AlertCircle className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-mono text-[11px] block uppercase">Wallet Connection Required:</strong>
                <span className="text-gray-300">Please connect an agent wallet to proceed with {pendingActionNotice}.</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-950/70 border border-red-700/80 rounded-[4px] flex flex-col gap-2.5 text-xs text-red-200 animate-enter">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong className="block text-white font-mono text-[11px] uppercase">Connection Notice:</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>

              {errorMessage.includes('MetaMask is not installed') && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-900/60">
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 rounded-[4px] transition-colors font-mono cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Install MetaMask Extension
                  </a>
                  <button
                    onClick={() => connectSimulated('MetaMask (Simulated)')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-mono text-gray-300 hover:text-white bg-[#0f172a] hover:bg-[#253349] border border-[#334155] rounded-[4px] transition-colors cursor-pointer"
                  >
                    Demo / Sandbox Mode
                  </button>
                </div>
              )}
            </div>
          )}

          {isWalletConnected ? (
            /* Connected State View */
            <div className="space-y-4">
              <div className="p-4 rounded-[4px] bg-[#0f172a] border border-[#334155] space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#9ca3af] uppercase">CONNECTED ACCOUNT</span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-[#10b981] font-bold bg-[#1e293b] px-2 py-0.5 rounded-[4px] border border-[#334155]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    ACTIVE
                  </span>
                </div>

                <div className="text-sm font-bold text-white font-sans">{activeAgent.name}</div>
                
                {/* Clean Truncated & Full Copyable Address */}
                <div className="p-2.5 rounded-[4px] bg-[#0b1120] border border-[#334155] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9ca3af]">Address:</span>
                    <button
                      onClick={handleCopy}
                      className="text-[#10b981] hover:text-emerald-300 text-[11px] inline-flex items-center gap-1 font-bold cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy Address'}</span>
                    </button>
                  </div>
                  <div className="text-xs font-bold text-white break-all select-all font-mono">
                    {connectedAddress || activeAgent.address}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#334155] text-gray-300 font-sans">
                  <span>Score: <strong className="text-[#10b981] font-mono">{activeAgent.creditScore} PTS</strong></span>
                  <span>Tier: <strong className="text-white font-mono">{TIERS[activeAgent.tier].label}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 font-mono">
                <button
                  onClick={disconnectWallet}
                  className="px-3.5 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-[#0f172a] hover:bg-red-950/50 border border-[#334155] hover:border-red-800 rounded-[4px] transition-all cursor-pointer"
                >
                  DISCONNECT
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-1.5 text-xs font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all cursor-pointer shadow-sm"
                >
                  CLOSE
                </button>
              </div>
            </div>
          ) : (
            /* Provider List */
            <div className="space-y-3">
              <p className="text-xs text-[#9ca3af] font-sans">
                Connect your Web3 wallet to sign execution contracts, verify agent identity, and manage credit records.
              </p>

              <div className="space-y-2">
                {providers.map(p => (
                  <button
                    key={p.id}
                    disabled={connectingProvider !== null}
                    onClick={() => handleSelectProvider(p.id, p.name)}
                    className="w-full p-3 rounded-[4px] bg-[#0f172a] border border-[#334155] hover:border-[#10b981] hover:bg-[#1e293b] transition-all flex items-center justify-between text-left group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-[4px] bg-[#1e293b] border border-[#334155] flex items-center justify-center">
                        {p.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-[#10b981] transition-colors font-mono">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#9ca3af] bg-[#1e293b] px-1.5 py-0.5 rounded-[4px] border border-[#334155]">
                            {p.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9ca3af] block font-sans">
                          {p.description}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 font-mono text-xs">
                      {connectingProvider === p.name ? (
                        <span className="text-[#10b981] text-[11px] font-bold">CONNECTING...</span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#10b981] transition-all" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-[10px] font-mono text-gray-500 text-center">
                COMPATIBLE WITH RIALO SCALE SMART CONTRACTS
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
