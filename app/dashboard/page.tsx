'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }
      
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/auth');
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c89968] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#c89968] rounded"></div>
              <span className="text-xl font-semibold text-gray-900">ソーシャル</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">ホーム</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">マーケットプレイス</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">ウォレット</a>
              
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 bg-[#d97706] text-white rounded-lg hover:bg-[#c89968] transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                こんにちは、{user?.user_metadata?.username || 'ユーザー名'}さん
              </h2>
              <p className="text-gray-600 mb-6">ようこそ、ワンネスキングダムへ！</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">貢献ポイント</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">2,450</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">完了したタスク</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    <span className="text-sm text-gray-600">レビュー投稿数</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">32</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">最近の活動</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-[#d97706] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-gray-900">新しい写真を投稿しました『桜の季節』</p>
                      <p className="text-gray-500 text-xs">2時間前</p>
                    </div>
                    <span className="text-[#16a34a] font-medium">+10ポイント</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-[#d97706] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-gray-900">『手作りセラミックボウル』にレビューを投稿しました</p>
                      <p className="text-gray-500 text-xs">昨日</p>
                    </div>
                    <span className="text-[#16a34a] font-medium">+5ポイント</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">コミュニティハイライト</h3>
                <a href="#" className="text-sm text-[#d97706] hover:underline">もっと見る →</a>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900"></div>
                  <div className="absolute top-2 left-2 bg-[#d97706] text-white text-xs px-2 py-1 rounded">トレンド</div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm font-medium">#週末の京都散歩</p>
                    <p className="text-white/80 text-xs">1.2万件の投稿</p>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm font-medium">#手作り陶器</p>
                    <p className="text-white/80 text-xs">9.7千件の投稿</p>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm font-medium">#ミニマリストの生活</p>
                    <p className="text-white/80 text-xs">4.5千件の投稿</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">通知</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#d97706] rounded-full flex items-center justify-center text-white font-medium">田</div>
                  <div className="flex-1 text-sm">
                    <p className="text-gray-900"><strong>田中理恵</strong>さんがあなたの投稿を「いいね！」しました。</p>
                    <p className="text-gray-500 text-xs mt-1">5分前</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#c89968] rounded-full flex items-center justify-center text-white font-medium">伊</div>
                  <div className="flex-1 text-sm">
                    <p className="text-gray-900"><strong>伊藤由香</strong>さんがあなたをフォローしました。</p>
                    <p className="text-gray-500 text-xs mt-1">1時間前</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#a3a3a3] rounded-full flex items-center justify-center text-white font-medium">山</div>
                  <div className="flex-1 text-sm">
                    <p className="text-gray-900"><strong>山本聡太</strong>さんがあなたの投稿にコメントしました。「素敵な写真ですね！」</p>
                    <p className="text-gray-500 text-xs mt-1">3時間前</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#d97706] to-[#c89968] rounded-lg shadow p-6 text-white">
              <h3 className="font-semibold mb-2">クイックアクション</h3>
              <div className="space-y-3 mt-4">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg transition text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  新しい投稿を作成
                </button>

                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg transition text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  商品を出品
                </button>

                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg transition text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  プロフィールを見る
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">統計情報</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">フォロワー</span>
                  <span className="font-semibold text-gray-900">1,204</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">投稿</span>
                  <span className="font-semibold text-gray-900">86</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">出品中の商品</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
