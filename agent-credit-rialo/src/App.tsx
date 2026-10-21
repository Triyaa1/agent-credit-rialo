/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TaskMarketplace } from './components/TaskMarketplace';
import { CollateralCalculator } from './components/CollateralCalculator';
import { Leaderboard } from './components/Leaderboard';
import { MyDashboard } from './components/MyDashboard';
import { HowItWorks } from './components/HowItWorks';
import { ActivityFeed } from './components/ActivityFeed';
import { PassportModal } from './components/PassportModal';
import { AgentProfileModal } from './components/AgentProfileModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { RegisterAgentModal } from './components/RegisterAgentModal';
import { AgentSwitcherModal } from './components/AgentSwitcherModal';
import { SharkTankPitchModal } from './components/SharkTankPitchModal';
import { WalletConnectModal } from './components/WalletConnectModal';
import { Footer } from './components/Footer';
import { formatRLO } from './utils/creditScore';

const MainContent: React.FC = () => {
  const { 
    metrics, 
    passports, 
    selectedPassport, 
    setSelectedPassport,
    selectedAgentProfile,
    setSelectedAgentProfile,
    agents,
    isWalletConnected,
    requireWallet
  } = useApp();

  // Default to dedicated Landing Page ('home')
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState<boolean>(false);
  const [isRegisterAgentOpen, setIsRegisterAgentOpen] = useState<boolean>(false);
  const [isAgentSwitcherOpen, setIsAgentSwitcherOpen] = useState<boolean>(false);
  const [isPitchOpen, setIsPitchOpen] = useState<boolean>(false);

  const handleOpenPassport = (passportId: string) => {
    const found = passports.find(p => p.id === passportId);
    if (found) {
      setSelectedPassport(found);
    }
  };

  const handleOpenAgentProfile = (address: string) => {
    const found = agents.find(a => a.address.toLowerCase() === address.toLowerCase());
    if (found) {
      setSelectedAgentProfile(found);
    }
  };

  const handleOpenCreateTask = () => {
    requireWallet('creating a new task docket', () => {
      setIsCreateTaskOpen(true);
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-gray-100 flex flex-col font-sans selection:bg-[#10b981] selection:text-gray-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAgentSwitcher={() => setIsAgentSwitcherOpen(true)}
        onOpenPitch={() => setIsPitchOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* If on App Views (non-home), show the institutional Bloomberg / Banking KPI Bar */}
        {currentTab !== 'home' && (
          <section aria-label="Bureau Metrics" className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-enter">
            <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1 font-mono shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-medium">
                Total Transacted Principal
              </span>
              <div className="text-xl lg:text-2xl font-bold text-white tabular-nums">
                {formatRLO(metrics.totalVolumeTransacted)}
              </div>
              <span className="text-[10px] text-[#9ca3af] block font-sans">
                Across verified dockets
              </span>
            </div>

            <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1 font-mono shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-[#10b981] font-medium">
                Capital Freed From Escrow
              </span>
              <div className="text-xl lg:text-2xl font-bold text-[#10b981] tabular-nums">
                +{formatRLO(metrics.totalCapitalSaved)}
              </div>
              <span className="text-[10px] text-[#9ca3af] block font-sans">
                Recovered via reputation
              </span>
            </div>

            <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1 font-mono shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">
                Passports Recorded
              </span>
              <div className="text-xl lg:text-2xl font-bold text-white tabular-nums">
                {metrics.totalPassportsIssued} <span className="text-xs text-[#9ca3af] font-normal">SEALS</span>
              </div>
              <span className="text-[10px] text-[#9ca3af] block font-sans">
                SHA-256 cryptographic digests
              </span>
            </div>

            <div className="p-3.5 rounded-[4px] bg-[#1e293b] border border-[#334155] space-y-1 font-mono shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-medium">
                Mean Credit Score
              </span>
              <div className="text-xl lg:text-2xl font-bold text-white tabular-nums">
                {metrics.averageCreditScore} <span className="text-xs text-[#9ca3af] font-normal">PTS</span>
              </div>
              <span className="text-[10px] text-[#9ca3af] block font-sans">
                Network-wide index
              </span>
            </div>
          </section>
        )}

        {/* Tab 0: Dedicated Landing Page */}
        {currentTab === 'home' && (
          <LandingPage
            onLaunchApp={() => setCurrentTab('dashboard')}
            onExploreTasks={() => setCurrentTab('marketplace')}
            onExploreLeaderboard={() => setCurrentTab('leaderboard')}
          />
        )}

        {/* Tab 1: Marketplace / Tasks */}
        {currentTab === 'marketplace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              <TaskMarketplace
                onOpenCreateTask={handleOpenCreateTask}
                onOpenPassport={handleOpenPassport}
                onOpenAgentProfile={handleOpenAgentProfile}
              />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <ActivityFeed
                onOpenPassport={handleOpenPassport}
                onOpenAgentProfile={handleOpenAgentProfile}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {currentTab === 'leaderboard' && (
          <Leaderboard
            onSelectAgent={(agent) => setSelectedAgentProfile(agent)}
          />
        )}

        {/* Tab 3: Collateral Calculator */}
        {currentTab === 'calculator' && (
          <CollateralCalculator />
        )}

        {/* Tab 4: Dashboard */}
        {currentTab === 'dashboard' && (
          <MyDashboard
            onOpenCreateTask={handleOpenCreateTask}
            onOpenPassport={handleOpenPassport}
            onOpenAgentSwitcher={() => setIsAgentSwitcherOpen(true)}
          />
        )}

        {/* Tab 5: How It Works */}
        {currentTab === 'how-it-works' && (
          <HowItWorks
            onTryDemo={() => setIsPitchOpen(true)}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Modals */}
      <WalletConnectModal />

      <PassportModal
        passport={selectedPassport}
        onClose={() => setSelectedPassport(null)}
        onViewAgent={handleOpenAgentProfile}
      />

      <AgentProfileModal
        agent={selectedAgentProfile}
        onClose={() => setSelectedAgentProfile(null)}
        onOpenPassport={handleOpenPassport}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />

      <RegisterAgentModal
        isOpen={isRegisterAgentOpen}
        onClose={() => setIsRegisterAgentOpen(false)}
      />

      <AgentSwitcherModal
        isOpen={isAgentSwitcherOpen}
        onClose={() => setIsAgentSwitcherOpen(false)}
        onOpenRegister={() => setIsRegisterAgentOpen(true)}
      />

      <SharkTankPitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onInspectPassport={handleOpenPassport}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
