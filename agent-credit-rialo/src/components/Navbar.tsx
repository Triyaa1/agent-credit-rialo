import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TIERS, formatAddress } from '../utils/creditScore';
import { 
  ChevronDown, 
  Wallet, 
  Copy, 
  Check, 
  LogOut, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAgentSwitcher: () => void;
  onOpenPitch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAgentSwitcher,
  onOpenPitch
}) => {
  const { 
    activeAgent, 
    isWalletConnected, 
    connectedAddress, 
    walletProviderName,
    disconnectWallet,
    setIsConnectModalOpen 
  } = useApp();

  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tierConfig = TIERS[activeAgent.tier];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWalletDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    const addr = connectedAddress || activeAgent.address;
    if (addr) {
      navigator.clipboard.writeText(addr);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnectWallet();
    setIsWalletDropdownOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'marketplace', label: 'Tasks' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'calculator', label: 'Collateral' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b1120]/90 border-b border-[#334155] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Zone: Extracted Central Icon Alone (Transparent Background) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            title="Agent Credit Passport — Home"
          >
            <img 
              src="/logo-icon.png" 
              alt="Agent Credit Passport Icon" 
              className="h-[36px] w-auto object-contain transition-all duration-200 hover:opacity-80 group-hover:scale-105 cursor-pointer"
              style={{ height: '36px' }}
              loading="eager"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white font-mono group-hover:text-[#10b981] transition-colors">
                Agent Credit Passport
              </span>
              <span className="hidden sm:inline-block text-[10px] text-[#9ca3af] font-mono bg-[#1e293b] px-1.5 py-0.5 rounded-[4px] border border-[#334155]">
                Rialo SCALE
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#9ca3af]">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 font-mono ${
                currentTab === link.id 
                  ? 'text-white font-bold border-[#10b981]' 
                  : 'border-transparent hover:text-gray-200'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Zone: Wallet Connection & Agent Session */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Pitch mode shortcut */}
          <button
            onClick={onOpenPitch}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-gray-300 hover:text-white bg-[#1e293b] hover:bg-[#253349] border border-[#334155] rounded-[4px] transition-colors whitespace-nowrap shadow-sm hover:shadow"
          >
            Pitch Tour
          </button>

          {/* Wallet Connection Button / Connected Dropdown */}
          {!isWalletConnected ? (
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-mono font-bold text-gray-950 bg-[#10b981] hover:bg-emerald-400 active:bg-emerald-600 rounded-[4px] transition-all inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm hover:shadow-md cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-gray-950" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1e293b] hover:bg-[#253349] border border-[#334155] hover:border-[#475569] rounded-[4px] transition-all font-mono text-xs text-gray-200 shadow-sm cursor-pointer"
                title="Wallet Connected — Click for options"
                aria-expanded={isWalletDropdownOpen}
              >
                <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0"></span>
                <span className="text-white font-semibold">
                  {formatAddress(connectedAddress || activeAgent.address)}
                </span>
                <span className="hidden sm:inline-block text-[10px] text-[#10b981] font-bold bg-[#0b1120] px-1.5 py-0.5 rounded-[4px] border border-[#334155]">
                  {activeAgent.creditScore} PTS
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isWalletDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Institutional Dropdown Menu */}
              {isWalletDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1e293b] border border-[#334155] rounded-[4px] shadow-xl p-3 space-y-3 z-50 animate-enter font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                      <span className="text-[11px] font-mono font-bold text-gray-300 uppercase">
                        {walletProviderName || 'Injected Wallet'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#10b981] bg-[#0b1120] px-1.5 py-0.5 rounded-[4px] border border-[#334155]">
                      CONNECTED
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#9ca3af] block">ACCOUNT ADDRESS</span>
                    <div className="flex items-center justify-between gap-1 p-1.5 bg-[#0b1120] border border-[#334155] rounded-[4px]">
                      <span className="text-xs font-mono text-gray-200 truncate select-all">
                        {connectedAddress || activeAgent.address}
                      </span>
                      <button
                        onClick={handleCopyAddress}
                        className="p-1 hover:bg-[#1e293b] rounded text-gray-400 hover:text-white transition-colors shrink-0"
                        title="Copy full address"
                      >
                        {copiedAddress ? (
                          <Check className="w-3.5 h-3.5 text-[#10b981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-col gap-1.5 font-mono text-xs">
                    <button
                      onClick={() => {
                        setIsWalletDropdownOpen(false);
                        setIsConnectModalOpen(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-[4px] hover:bg-[#253349] text-gray-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>Switch Provider</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-2.5 py-1.5 rounded-[4px] hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors flex items-center justify-between border border-transparent hover:border-red-900/50"
                    >
                      <span>Disconnect Wallet</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Agent Switcher Shortcut */}
          <button
            onClick={onOpenAgentSwitcher}
            className="h-8 px-2 rounded-[4px] bg-[#1e293b] hover:bg-[#253349] border border-[#334155] flex items-center justify-center text-xs font-mono text-gray-300 hover:text-white transition-colors shadow-sm cursor-pointer"
            title={`Active Agent: ${activeAgent.name}`}
          >
            {activeAgent.name.slice(0, 2).toUpperCase()}
          </button>
        </div>
      </div>

      {/* Mobile sub-bar */}
      <div className="md:hidden flex items-center gap-2 px-4 py-1.5 border-t border-[#334155] bg-[#0b1120] overflow-x-auto text-xs font-mono">
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => onSelectTab(link.id)}
            className={`px-2.5 py-1 rounded-[4px] whitespace-nowrap transition-colors ${
              currentTab === link.id
                ? 'bg-[#1e293b] text-[#10b981] font-bold border border-[#334155]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
