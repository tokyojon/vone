"use client";

import { useEffect, useState, ReactElement } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState("contributions");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (data) {
      setProfile(data);

      // Fetch user activities
      const { data: actData } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", data.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (actData) {
        setActivities(actData);
      }
    }
    setLoading(false);
  };

  const getActivityIcon = (activityType: string) => {
    const iconMap: { [key: string]: ReactElement } = {
      photo_uploaded: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      community_joined: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      challenge_completed: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      skill_added: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      ),
    };
    return iconMap[activityType] || iconMap.photo_uploaded;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays === 1) return "昨日";
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString("ja-JP");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="size-32 rounded-full bg-gradient-to-br from-[#c89968] to-[#ec6d13] mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary mb-1">
                  {profile?.full_name || "ユーザー"}
                </h2>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-2">
                  @{username}
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-[#c89968]/20 text-[#c89968] text-sm font-medium">
                  メンバー
                </span>
              </div>

              <p className="text-text-light-secondary dark:text-text-dark-secondary text-center mb-6">
                {profile?.bio || "このユーザーはまだ自己紹介を書いていません。"}
              </p>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                    isFollowing
                      ? "bg-border-light dark:bg-border-dark text-text-light-primary dark:text-text-dark-primary"
                      : "bg-[#c89968] text-white hover:bg-[#b8895a]"
                  }`}
                >
                  {isFollowing ? "フォロー中" : "フォローする"}
                </button>
                <button className="flex-1 py-2 px-4 rounded-xl font-medium bg-border-light dark:bg-border-dark text-text-light-primary dark:text-text-dark-primary hover:bg-border-light/70 dark:hover:bg-border-dark/70 transition-colors">
                  メッセージを...
                </button>
                <button className="p-2 rounded-xl bg-border-light dark:bg-border-dark hover:bg-border-light/70 dark:hover:bg-border-dark/70 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>

              <div className="border-t border-border-light dark:border-border-dark pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-light-secondary dark:text-text-dark-secondary">
                    フォロワー
                  </span>
                  <span className="font-bold text-text-light-primary dark:text-text-dark-primary">
                    {profile?.followers_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-light-secondary dark:text-text-dark-secondary">
                    投稿
                  </span>
                  <span className="font-bold text-text-light-primary dark:text-text-dark-primary">
                    {profile?.posts_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-light-secondary dark:text-text-dark-secondary">
                    貢献ポイント
                  </span>
                  <span className="font-bold text-primary">
                    {profile?.contribution_points || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Activity Feed */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-6 mb-6 border-b border-border-light dark:border-border-dark">
              {[
                { id: "contributions", label: "貢献ログ" },
                { id: "skills", label: "スキル" },
                { id: "family", label: "家族" },
                { id: "community", label: "コミュニティ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 text-text-light-secondary dark:text-text-dark-secondary opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-text-light-secondary dark:text-text-dark-secondary">
                    まだアクティビティがありません
                  </p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-light-primary dark:text-text-dark-primary mb-1">
                        {activity.description}
                      </p>
                      <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                        {formatTimeAgo(activity.created_at)}
                      </p>
                    </div>
                    <button className="text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
