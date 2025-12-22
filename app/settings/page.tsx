'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    website_url: '',
    notification_new_followers: true,
    notification_comments: true,
    notification_likes: false,
    notification_email: true,
    account_public: true,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile({
        username: data.username || '',
        full_name: data.full_name || '',
        bio: data.bio || '',
        website_url: data.website_url || '',
        notification_new_followers: data.notification_new_followers ?? true,
        notification_comments: data.notification_comments ?? true,
        notification_likes: data.notification_likes ?? false,
        notification_email: data.notification_email ?? true,
        account_public: data.account_public ?? true,
      });
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        website_url: profile.website_url,
      })
      .eq('id', user.id);

    if (error) {
      alert('エラーが発生しました');
    } else {
      alert('プロフィールを更新しました');
    }
    setSaving(false);
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        notification_new_followers: profile.notification_new_followers,
        notification_comments: profile.notification_comments,
        notification_likes: profile.notification_likes,
        notification_email: profile.notification_email,
      })
      .eq('id', user.id);

    if (error) {
      alert('エラーが発生しました');
    } else {
      alert('通知設定を更新しました');
    }
    setSaving(false);
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        account_public: profile.account_public,
      })
      .eq('id', user.id);

    if (error) {
      alert('エラーが発生しました');
    } else {
      alert('プライバシー設定を更新しました');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">読み込み中...</div>;
  }

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
          <div>
            <h1 className="text-3xl font-black text-text-light-primary dark:text-text-dark-primary">
              プロフィール編集
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              アカウント情報を更新します。
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div className="border-b border-border-light dark:border-border-dark px-6 py-4">
              <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
                プロフィール写真
              </h2>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                JPG, GIF, またはPNG。最大800KBです。
              </p>
            </div>
            <div className="p-6 flex items-center gap-4">
              <div className="size-16 rounded-full bg-border-light dark:bg-border-dark"></div>
              <button className="btn-secondary">
                画像をアップロード
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div className="border-b border-border-light dark:border-border-dark px-6 py-4">
              <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
                プロフィール写真
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    ユーザー名
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="@kenji_t"
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    本名
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Kenji Tanaka"
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  自己紹介
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="本名住のデザイナー。ミニマリズムと自然からインスピレーションを得ています。"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  ウェブサイト
                </label>
                <input
                  type="url"
                  value={profile.website_url}
                  onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                  placeholder="https://kenji-design.jp"
                  className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button onClick={() => router.back()} className="btn-secondary">
                  キャンセル
                </button>
                <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
                  {saving ? '保存中...' : '変更を保存'}
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div className="border-b border-border-light dark:border-border-dark px-6 py-4">
              <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
                通知設定
              </h2>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                通知の受け取り方を管理します。
              </p>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'notification_new_followers', label: '新しいフォロワー', desc: '新しいフォロワーができたときに通知します。' },
                { key: 'notification_comments', label: 'コメント', desc: 'あなたの投稿にコメントがあったときに通知します。' },
                { key: 'notification_likes', label: 'いいね', desc: 'あなたの投稿に「いいね！」があったときに通知します。' },
                { key: 'notification_email', label: 'メール通知', desc: '重要な更新をメールで受け取ります。' },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium text-text-light-primary dark:text-text-dark-primary">
                      {item.label}
                    </p>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile[item.key as keyof typeof profile] as boolean}
                      onChange={(e) => setProfile({ ...profile, [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-border-light dark:bg-border-dark peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button onClick={handleSaveNotifications} disabled={saving} className="btn-primary">
                  {saving ? '保存中...' : '変更を保存'}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div className="border-b border-border-light dark:border-border-dark px-6 py-4">
              <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
                プライバシー設定
              </h2>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                アカウントの公開範囲を管理します。
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between py-2">
                <div className="flex-1">
                  <p className="font-medium text-text-light-primary dark:text-text-dark-primary">
                    非公開アカウント
                  </p>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    オンにすると、あなたが承認したあなただけがあなたの投稿を見ることができます。
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!profile.account_public}
                    onChange={(e) => setProfile({ ...profile, account_public: !e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border-light dark:bg-border-dark peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={handleSavePrivacy} disabled={saving} className="btn-primary">
                  {saving ? '保存中...' : '変更を保存'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Deletion */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-red-200 dark:border-red-900 overflow-hidden">
            <div className="border-b border-red-200 dark:border-red-900 px-6 py-4">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                アカウント削除
              </h2>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                アカウントを完全に削除します。
              </p>
            </div>
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 dark:text-red-300">
                  この操作は元に戻せません。アカウントを削除すると、すべてのプロフィール、投稿、写真、コメント等の完全な削除が行われます。続行する前に、必要なデータのバックアップをしてください。
                </p>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                アカウントを完全に削除する
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
