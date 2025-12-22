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

  const mockListings = [
    {
      id: '1',
      title: 'Need help with garden design',
      description: 'Gardening, Design, Outdoors',
      user: 'Yuki Tanaka',
      category: 'gardening',
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400'
    },
    {
      id: '2',
      title: 'Looking for a Japanese tutor',
      description: 'Language, Tutoring, Japanese',
      user: 'Haru Ito',
      category: 'tutoring',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'
    },
    {
      id: '3',
      title: 'Dog walker needed for weekday afternoons',
      description: 'Pets, Dog Walking',
      user: 'Airi Sato',
      category: 'pets',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
    },
    {
      id: '4',
      title: 'Help moving a sofa',
      description: 'Manual Labor, Moving',
      user: 'Kaito Suzuki',
      category: 'manual_labor',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
    },
    {
      id: '5',
      title: 'Seeking a photographer for a small event',
      description: 'Photography, Events',
      user: 'Rin Takahashi',
      category: 'photography',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400'
    },
    {
      id: '6',
      title: 'Website design consultation',
      description: 'Web Design, UX, UI',
      user: 'Sota Watanabe',
      category: 'web_design',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400'
    },
    {
      id: '7',
      title: 'Need someone to assemble IKEA furniture',
      description: 'Furniture, Assembly',
      user: 'Mei Nakamura',
      category: 'manual_labor',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
    },
    {
      id: '8',
      title: 'Requesting a hand-made birthday cake',
      description: 'Baking, Cooking, Desserts',
      user: 'Ren Yamamoto',
      category: 'cooking',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400'
    },
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${listing.image})` }}
                ></div>
                <div className="p-4">
                  <h3 className="font-bold text-text-light-primary dark:text-text-dark-primary mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-3 line-clamp-1">
                    {listing.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-border-light dark:bg-border-dark"></div>
                    <span className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                      {listing.user}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredListings.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              該当する出品が見つかりませんでした。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
