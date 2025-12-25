'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [listingsCount, setListingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Refresh the profile data to get updated onboarding status
    if (user) {
      supabase
        .from('profiles')
        .select('username, contribution_points, tasks_completed, reviews_posted, followers_count, posts_count, onboarding_completed')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    }
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }
      
      setUser(user);

      // 1. Fetch Profile Stats
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, contribution_points, tasks_completed, reviews_posted, followers_count, posts_count, onboarding_completed')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
        // Check if onboarding is needed
        if (!profileData.onboarding_completed) {
          setShowOnboarding(true);
        }
      }

      // 2. Fetch Active Listings Count
      const { count: lCount } = await supabase
        .from('marketplace_listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      setListingsCount(lCount || 0);

      // 3. Fetch Recent Activities
      const { data: activityData } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (activityData) setActivities(activityData);

      // 4. Fetch Notifications (with sender info)
      const { data: notifData } = await supabase
        .from('notifications')
        .select(`
          id, type, message, created_at,
          from_user:from_user_id (username, full_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (notifData) {
        // Cast the joined data manually since TS inference can be tricky with joins
        const formattedNotifs = notifData.map(n => ({
          ...n,
          from_user: Array.isArray(n.from_user) ? n.from_user[0] : n.from_user
        })) as any;
        setNotifications(formattedNotifs);
      }

      // 5. Fetch Trending Posts (Community Highlights)
      const { data: postData } = await supabase
        .from('posts')
        .select('id, title, likes_count, image_url')
        .order('likes_count', { ascending: false })
        .limit(3);

      if (postData) setTrendingPosts(postData);

      setLoading(false);
    };

    fetchData();

    // Auth Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') router.push('/auth');
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-text-light-secondary dark:text-text-dark-secondary">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Overview */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
                こんにちは、{profile?.username || user?.email?.split('@')[0]}さん
              </h2>
              <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">ようこそ、ワンネスキングダムへ！</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs sm:text-sm text-text-light-secondary dark:text-text-dark-secondary">貢献ポイント</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
                    {profile?.contribution_points?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm text-text-light-secondary dark:text-text-dark-secondary">完了タスク</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
                    {profile?.tasks_completed || 0}
                  </p>
                </div>

                <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    <span className="text-xs sm:text-sm text-text-light-secondary dark:text-text-dark-secondary">レビュー数</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
                    {profile?.reviews_posted || 0}
                  </p>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="border-t border-border-light dark:border-border-dark pt-4">
                <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-3">最近の活動</h3>
                <div className="space-y-3">
                  {activities.length === 0 ? (
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      まだ活動履歴がありません。
                    </p>
                  ) : (
                    activities.map((act) => (
                      <div key={act.id} className="flex items-start gap-3 text-sm">
                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-text-light-primary dark:text-text-dark-primary">
                            {act.description || '活動がありました'}
                          </p>
                          <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs">
                            {timeAgo(act.created_at)}
                          </p>
                        </div>
                        {act.points_earned > 0 && (
                          <span className="text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
                            +{act.points_earned} pt
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Community Highlights (Trending Posts) */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow p-6 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary">コミュニティハイライト</h3>
                <Link href="/community" className="text-sm text-primary hover:underline">
                  もっと見る →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {trendingPosts.length === 0 ? (
                  <div className="col-span-3 text-center py-8 bg-background-light dark:bg-background-dark rounded-lg">
                    <p className="text-text-light-secondary dark:text-text-dark-secondary">まだ投稿がありません</p>
                  </div>
                ) : (
                  trendingPosts.map((post) => (
                    <div key={post.id} className="relative rounded-lg overflow-hidden aspect-square bg-background-light dark:bg-background-dark group cursor-pointer border border-border-light dark:border-border-dark">
                      {post.image_url ? (
                        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                          <span className="text-4xl">📄</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded shadow-md">
                        トレンド
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-medium line-clamp-1">{post.title || '無題'}</p>
                        <p className="text-white/80 text-xs">❤️ {post.likes_count} いいね</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Notifications */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow p-6 border border-border-light dark:border-border-dark">
              <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">通知</h3>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary text-center py-4">
                    新しい通知はありません
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center text-orange-800 dark:text-orange-200 font-bold shrink-0">
                        {notif.from_user?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="text-text-light-primary dark:text-text-dark-primary">
                          <strong>{notif.from_user?.full_name || '誰か'}</strong>
                          {notif.message ? ` ${notif.message}` : ' さんから通知がありました'}
                        </p>
                        <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs mt-1">
                          {timeAgo(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#d97706] to-[#c89968] rounded-xl shadow p-6 text-white">
              <h3 className="font-semibold mb-2">クイックアクション</h3>
              <div className="space-y-3 mt-4">
                <Link href="/create-post" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg transition text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  新しい投稿を作成
                </Link>

                <Link href="/marketplace/create" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg transition text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  商品を出品
                </Link>

                <Link href={`/profile/${profile?.username}`} className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg transition text-left flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  プロフィールを見る
                </Link>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow p-6 border border-border-light dark:border-border-dark">
              <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">統計情報</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">フォロワー</span>
                  <span className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                    {profile?.followers_count?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">投稿</span>
                  <span className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                    {profile?.posts_count?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">出品中の商品</span>
                  <span className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                    {listingsCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && user && (
        <OnboardingModal
          userId={user.id}
          onComplete={handleOnboardingComplete}
          onClose={handleOnboardingClose}
        />
      )}
    </div>
  );
}
