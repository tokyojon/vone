'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Transaction {
  id: string;
  transaction_type: string;
  currency_type: string;
  amount: number;
  description: string;
  created_at: string;
  from_user_id: string;
}

export default function Wallet() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wnpPoints, setWnpPoints] = useState(0);
  const [ontTokens, setOntTokens] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    // Fetch wallet balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('wnp_points, ont_tokens')
      .eq('id', user.id)
      .single();

    if (profile) {
      setWnpPoints(profile.wnp_points || 0);
      setOntTokens(profile.ont_tokens || 0);
    }

    // Fetch transactions
    const { data: txData, count } = await supabase
      .from('wallet_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (txData && txData.length > 0) {
      setTransactions(txData);
    } else if (count === 0) {
      // Auto-grant Welcome Bonus if no transactions exist
      await grantWelcomeBonus(user.id);
      return; // recursion will happen via state update or re-fetch
    }

    setLoading(false);
  };

  const grantWelcomeBonus = async (userId: string) => {
    try {
      // 1. Create Transaction
      const { error: txError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'gift',
          currency_type: 'WNP',
          amount: 500,
          description: '🎉 ウェルカムボーナス',
        });

      if (txError) throw txError;

      // 2. Update Profile Balance
      const { error: profileError } = await supabase.rpc('increment_wnp', { 
        row_id: userId, 
        amount: 500 
      });
      
      // Fallback if RPC doesn't exist (update directly)
      if (profileError) {
         const { data: currentProfile } = await supabase
           .from('profiles')
           .select('wnp_points')
           .eq('id', userId)
           .single();
         
         if (currentProfile) {
            await supabase
              .from('profiles')
              .update({ wnp_points: (currentProfile.wnp_points || 0) + 500 })
              .eq('id', userId);
         }
      }

      // 3. Reload Data
      checkUser();
    } catch (e) {
      console.error('Error granting bonus:', e);
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
            <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
          </svg>
        );
      case 'like':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      case 'exchange':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
          </svg>
        );
      case 'login_bonus':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'earned') return tx.amount > 0;
    if (activeTab === 'used') return tx.amount < 0;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex size-10 items-center justify-center rounded-lg hover:bg-border-light dark:hover:bg-border-dark"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-4xl font-black text-text-light-primary dark:text-text-dark-primary">
            ウォレット
          </h1>
          <button 
            onClick={() => { setLoading(true); checkUser(); }}
            className="ml-auto p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="更新"
          >
            <svg className={`w-5 h-5 text-text-light-secondary ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#c89968] to-[#ec6d13] rounded-xl p-8 mb-8 text-white">
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-2">現在のワンネスポイント（WNP）</p>
            <p className="text-5xl font-bold">{wnpPoints.toLocaleString()}</p>
          </div>
          <div className="mb-8">
            <p className="text-white/80 text-sm mb-2">換金可能なONT</p>
            <p className="text-3xl font-bold">{ontTokens.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-xl transition text-white font-medium">
              ポイントを送る
            </button>
            <button className="bg-white text-primary hover:bg-white/90 py-3 px-4 rounded-xl transition font-medium">
              ONTに変換
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border-light dark:border-border-dark">
          {[
            { id: 'all', label: 'すべて' },
            { id: 'earned', label: '獲得' },
            { id: 'used', label: '使用' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto mb-4 text-text-light-secondary dark:text-text-dark-secondary opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-text-light-secondary dark:text-text-dark-secondary">
                取引履歴がありません
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex size-12 items-center justify-center rounded-full ${
                    tx.amount > 0
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {getIcon(tx.transaction_type)}
                  </div>
                  <div>
                    <p className="font-medium text-text-light-primary dark:text-text-dark-primary">
                      {tx.description}
                    </p>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      {formatDate(tx.created_at)}
                    </p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${
                  tx.amount > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency_type}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
