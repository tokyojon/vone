'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
  };
}

export default function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        profiles:user_id (username, full_name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (data) {
      setListings(data as unknown as Listing[]);
    }
    setLoading(false);
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'gardening', name: '庭' },
    { id: 'tutoring', name: '教育' },
    { id: 'photography', name: '写真' },
    { id: 'web_design', name: 'ウェブデザイン' },
    { id: 'cooking', name: '料理' },
    { id: 'pets', name: 'ペット' },
    { id: 'manual_labor', name: '肉体労働' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-text-light-primary dark:text-text-dark-primary flex items-center gap-3">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              マーケットプレイス
            </h1>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            出品する
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="スキル、キーワードで検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light-secondary dark:text-text-dark-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-border-light dark:bg-border-dark text-text-light-primary dark:text-text-dark-primary hover:bg-border-light/70 dark:hover:bg-border-dark/70'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-light-secondary dark:text-text-dark-secondary">読み込み中...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 mx-auto mb-4 text-text-light-secondary dark:text-text-dark-secondary opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-text-light-secondary dark:text-text-dark-secondary mb-2">
                {searchTerm || selectedCategory !== 'all' 
                  ? '該当する出品が見つかりませんでした。'
                  : 'まだ出品がありません'
                }
              </p>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-4">
                最初の出品者になりませんか？
              </p>
              <button className="btn-primary">
                サービスを出品する
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-border-light to-border-light/50 dark:from-border-dark dark:to-border-dark/50 flex items-center justify-center">
                  <svg className="w-16 h-16 text-text-light-secondary dark:text-text-dark-secondary opacity-30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-text-light-primary dark:text-text-dark-primary mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-3 line-clamp-1">
                    {listing.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gradient-to-br from-[#c89968] to-[#ec6d13]"></div>
                    <span className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                      {listing.profiles?.full_name || listing.profiles?.username || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
