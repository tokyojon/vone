'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function Customize() {
  const router = useRouter();
  const [availableWidgets] = useState<Widget[]>([
    {
      id: 'my_posts',
      name: '自分の投稿',
      description: 'あなたの最近の投稿とエンゲージメント。',
      icon: 'table'
    },
    {
      id: 'trending',
      name: 'トレンド・ハイライト',
      description: 'コミュニティで話題になっていること。',
      icon: 'trending_up'
    },
    {
      id: 'recommendations',
      name: 'おすすめ',
      description: 'あなたにパーソナライズされたコンテンツ。',
      icon: 'recommend'
    },
    {
      id: 'bookmarks',
      name: 'ブックマーク',
      description: '保存した投稿や記事へのクイックアクセス。',
      icon: 'bookmark'
    },
  ]);

  const [activeWidgets, setActiveWidgets] = useState<Widget[]>([
    availableWidgets[0],
    availableWidgets[1],
    availableWidgets[2],
  ]);

  const addWidget = (widget: Widget) => {
    if (!activeWidgets.find(w => w.id === widget.id)) {
      setActiveWidgets([...activeWidgets, widget]);
    }
  };

  const removeWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter(w => w.id !== widgetId));
  };

  const resetToDefault = () => {
    setActiveWidgets([availableWidgets[0], availableWidgets[1], availableWidgets[2]]);
  };

  const saveChanges = () => {
    alert('ダッシュボードの設定を保存しました');
    router.push('/dashboard');
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      table: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
        </svg>
      ),
      trending_up: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      ),
      recommend: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      ),
      bookmark: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ),
      drag_indicator: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 10-4 0 2 2 0 004 0zM15 2a2 2 0 10-4 0 2 2 0 004 0zM7 10a2 2 0 10-4 0 2 2 0 004 0zM15 10a2 2 0 10-4 0 2 2 0 004 0zM7 18a2 2 0 10-4 0 2 2 0 004 0zM15 18a2 2 0 10-4 0 2 2 0 004 0z" />
        </svg>
      ),
    };
    return icons[iconName] || icons.table;
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="min-w-72">
            <h1 className="text-4xl font-black text-text-light-primary dark:text-text-dark-primary mb-2">
              ダッシュボードのカスタマイズ
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              ウィジェットを追加、削除、またはドラッグして、ダッシュボードを整理します。
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetToDefault}
              className="btn-secondary"
            >
              デフォルトに戻す
            </button>
            <button
              onClick={saveChanges}
              className="btn-primary"
            >
              変更を保存
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Widgets Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden sticky top-24">
              <div className="border-b border-border-light dark:border-border-dark px-4 pb-3 pt-5">
                <h2 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                  利用可能なウィジェット
                </h2>
              </div>
              <div className="divide-y divide-border-light dark:divide-border-dark">
                {availableWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center gap-4 px-4 py-2 min-h-[72px] justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-border-light dark:bg-border-dark text-text-light-primary dark:text-text-dark-primary">
                        {getIcon(widget.icon)}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-base font-medium leading-normal line-clamp-1 text-text-light-primary dark:text-text-dark-primary">
                          {widget.name}
                        </p>
                        <p className="text-sm font-normal leading-normal line-clamp-2 text-text-light-secondary dark:text-text-dark-secondary">
                          {widget.description}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <button
                        onClick={() => addWidget(widget)}
                        disabled={activeWidgets.some(w => w.id === widget.id)}
                        className={`px-4 h-8 rounded-xl text-sm font-medium transition-colors ${
                          activeWidgets.some(w => w.id === widget.id)
                            ? 'bg-border-light/50 dark:bg-border-dark/50 text-text-light-secondary dark:text-text-dark-secondary cursor-not-allowed'
                            : 'bg-border-light dark:bg-border-dark text-text-light-primary dark:text-text-dark-primary hover:bg-border-light/70 dark:hover:bg-border-dark/70'
                        }`}
                      >
                        追加
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Widgets Area */}
          <div className="lg:col-span-2">
            <div className="min-h-[400px] rounded-xl border-2 border-dashed border-border-light dark:border-border-dark p-4 space-y-4">
              {activeWidgets.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-text-light-secondary dark:text-text-dark-secondary">
                  左側からウィジェットを追加してください
                </div>
              ) : (
                activeWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="cursor-grab text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary">
                        {getIcon('drag_indicator')}
                      </span>
                      <p className="font-medium text-text-light-primary dark:text-text-dark-primary">
                        {widget.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-border-light dark:hover:bg-border-dark transition-colors">
                        <svg className="w-5 h-5 text-text-light-secondary dark:text-text-dark-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeWidget(widget.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                      >
                        <svg className="w-5 h-5 text-text-light-secondary dark:text-text-dark-secondary group-hover:text-red-600 dark:group-hover:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}

              {activeWidgets.length > 0 && (
                <div className="flex-1 rounded-lg border-2 border-dashed border-border-light/50 dark:border-border-dark/50 bg-background-light/50 dark:bg-background-dark/50 min-h-24"></div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
