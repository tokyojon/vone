'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, ChevronLeft, Sparkles, X } from 'lucide-react';

interface OnboardingModalProps {
  userId: string;
  onComplete: () => void;
  onClose: () => void;
}

const JAPAN_LOCATIONS = [
  '東京', '大阪', '京都', '横浜', '名古屋', '札幌', 
  '福岡', '神戸', '広島', '仙台', '奈良', '沖縄',
];

const GOOD_TRAITS = [
  '親しみやすい', 'クリエイティブ', '信頼できる', '冒険好き',
  '思いやりがある', '面白い', '世話好き', 'エネルギッシュ',
];

const BAD_TRAITS = ['頑固', '短気', '片付けが苦手', '人見知り'];

export default function OnboardingModal({ userId, onComplete, onClose }: OnboardingModalProps) {
  const [currentCard, setCurrentCard] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [characterProfile, setCharacterProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    relationship_status: '',
    location: '',
    good_traits: [] as string[],
    bad_traits: [] as string[],
    social_weekend: '',
    social_recharge: '',
    vacation_type: '',
    vacation_activity: '',
    planning_style: '',
    planning_preference: '',
    hobby_interest: '',
    hobby_activity: '',
    outlook: '',
  });

  const toggleTrait = (trait: string, isGood: boolean) => {
    if (isGood) {
      setFormData((prev) => ({
        ...prev,
        good_traits: prev.good_traits.includes(trait)
          ? prev.good_traits.filter((t) => t !== trait)
          : [...prev.good_traits, trait],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        bad_traits: prev.bad_traits.includes(trait)
          ? prev.bad_traits.filter((t) => t !== trait)
          : [...prev.bad_traits, trait],
      }));
    }
  };

  const generateCharacter = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Generation failed');
      
      const data = await response.json();
      setCharacterProfile(data);
    } catch (error) {
      console.error('Error:', error);
      // Fallback mock data if API fails or key is missing
      setCharacterProfile({
        name_jp: 'エラー発生',
        name_en: 'Error-chan',
        bio: 'APIキーが設定されていないか、エラーが発生しました。',
        ability: 'Retry',
        appearance: 'Please check console logs.'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleNext = async () => {
    if (currentCard < 5) {
      if (currentCard === 4) {
        // Just entering step 5, we can wait for user to finish step 5 to generate
        setCurrentCard(currentCard + 1);
      } else {
        setCurrentCard(currentCard + 1);
      }
    }
  };

  // Trigger generation when user finishes answering step 5 questions but hasn't submitted yet
  const handleStep5Complete = () => {
    if (!characterProfile && !generating && isCard5Valid) {
        generateCharacter();
    }
  };

  const handleBack = () => {
    if (currentCard > 1) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Save to database
    const { error: onboardingError } = await supabase
      .from('onboarding_responses')
      .insert({
        user_id: userId,
        ...formData,
        generated_character_profile: JSON.stringify(characterProfile),
      });

    if (onboardingError) {
      console.error('Error saving onboarding:', onboardingError);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    setLoading(false);
    onComplete();
  };

  const isCard1Valid = formData.relationship_status && formData.location && formData.good_traits.length > 0 && formData.bad_traits.length > 0;
  const isCard2Valid = formData.social_weekend && formData.social_recharge;
  const isCard3Valid = formData.vacation_type && formData.vacation_activity;
  const isCard4Valid = formData.planning_style && formData.planning_preference;
  const isCard5Valid = formData.hobby_interest && formData.hobby_activity && formData.outlook;

  return (
    <div className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background-light dark:bg-background-dark rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border-light dark:border-border-dark flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-orange-600 p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">V-Oneへようこそ</h2>
                <p className="text-orange-100 text-sm font-medium">あなたのプロフィールを作成します</p>
              </div>
            </div>
            <div className="text-sm font-bold bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
              Step {currentCard} / 5
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  num <= currentCard ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grow overflow-y-auto">
          {currentCard === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <label className="block text-lg font-bold text-text-light-primary dark:text-text-dark-primary mb-4">
                  交際ステータス
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['独身', '交際中', '既婚', 'その他'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, relationship_status: status })}
                      className={`px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                        formData.relationship_status === status
                          ? 'border-primary bg-orange-50 dark:bg-orange-900/20 text-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 text-text-light-secondary dark:text-text-dark-secondary'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-lg font-bold text-text-light-primary dark:text-text-dark-primary mb-4">
                  お住まいはどこですか？
                </label>
                <div className="relative">
                    <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:border-primary focus:outline-none appearance-none cursor-pointer"
                    >
                    <option value="">場所を選択してください</option>
                    {JAPAN_LOCATIONS.map((location) => (
                        <option key={location} value={location}>
                        {location}
                        </option>
                    ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-light-secondary">
                        <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>
                </div>
              </section>

              <section>
                <label className="block text-lg font-bold text-text-light-primary dark:text-text-dark-primary mb-4">
                  あなたの長所 <span className="text-sm font-normal text-text-light-secondary">(複数選択可)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {GOOD_TRAITS.map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => toggleTrait(trait, true)}
                      className={`px-4 py-2 rounded-full border-2 transition-all text-sm font-medium ${
                        formData.good_traits.includes(trait)
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'border-border-light dark:border-border-dark hover:border-green-200 text-text-light-secondary dark:text-text-dark-secondary'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-lg font-bold text-text-light-primary dark:text-text-dark-primary mb-4">
                  あなたの短所 <span className="text-sm font-normal text-text-light-secondary">(複数選択可)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {BAD_TRAITS.map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => toggleTrait(trait, false)}
                      className={`px-4 py-2 rounded-full border-2 transition-all text-sm font-medium ${
                        formData.bad_traits.includes(trait)
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : 'border-border-light dark:border-border-dark hover:border-red-200 text-text-light-secondary dark:text-text-dark-secondary'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {currentCard === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <label className="block text-xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
                  社交の好み
                </label>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  週末は賑やかなパーティーで過ごしたいですか、それとも静かに本を読んで過ごしたいですか？
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['賑やかなパーティー', '静かに読書'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, social_weekend: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.social_weekend === option
                          ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.social_weekend === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  たくさんの友人と一緒にいることで充電しますか、それとも一人でいることで充電しますか？
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['たくさんの友人', '一人で過ごす'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, social_recharge: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.social_recharge === option
                           ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.social_recharge === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {currentCard === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <section>
                <label className="block text-xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
                  旅行のスタイル
                </label>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  冒険的な山小屋での休暇と、リラックスできるビーチリゾート、どちらが好みですか？
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['山小屋', 'ビーチリゾート'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, vacation_type: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.vacation_type === option
                           ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.vacation_type === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  スリル満点のジェットコースターと、穏やかなボート、どちらを選びますか？
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['ジェットコースター', '穏やかなボート'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, vacation_activity: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.vacation_activity === option
                           ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.vacation_activity === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {currentCard === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <section>
                <label className="block text-xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
                  計画とライフスタイル
                </label>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  旅行を計画するとき、詳細な日程を決めたいですか、それともその場の気分で決めたいですか？
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['詳細な日程', 'その場の気分'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, planning_style: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.planning_style === option
                           ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.planning_style === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  突然のサプライズが好きですか、それとも家にいたいですか？
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['突然のサプライズ', '家にいたい'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, planning_preference: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.planning_preference === option
                           ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.planning_preference === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {currentCard === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <section>
                <label className="block text-xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
                  興味と展望
                </label>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  芸術や音楽と、数学や科学、どちらに惹かれますか？
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['芸術・音楽', '数学・科学'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, hobby_interest: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.hobby_interest === option
                           ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.hobby_interest === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
                  プロジェクトを立ち上げることと、論理パズルを解くこと、どちらが好みですか？
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['プロジェクト', 'パズル'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, hobby_activity: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.hobby_activity === option
                           ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.hobby_activity === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">コップの水は「もう半分しかない」と思いますか、「まだ半分ある」と思いますか？</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['まだ半分ある', 'もう半分しかない'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, outlook: option })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.outlook === option
                           ? 'border-primary bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-primary'
                          : 'border-border-light dark:border-border-dark hover:border-primary/50 hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <span className={`block text-lg font-bold mb-1 ${
                         formData.outlook === option ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'
                      }`}>{option}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Character Generation Section */}
              <div className="mt-8">
                {!characterProfile && !generating && (
                    <button
                        onClick={generateCharacter}
                        disabled={!isCard5Valid}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-primary/50 bg-orange-50/50 dark:bg-orange-900/10 text-primary font-bold hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles className="w-5 h-5" />
                        AIキャラクターを生成する
                    </button>
                )}

                {generating && (
                    <div className="p-8 text-center bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-lg">
                        <div className="animate-spin text-primary mx-auto mb-4">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-text-light-primary dark:text-text-dark-primary">
                            あなただけのキャラクターを作成中...
                        </p>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                            性格診断の結果を分析しています
                        </p>
                    </div>
                )}

                {characterProfile && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-950/20 rounded-xl border border-primary/30 p-6 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-black text-primary">
                                {characterProfile.name_jp || '名無しの権兵衛'} 
                                <span className="text-sm font-medium text-text-light-secondary ml-2 opacity-70">
                                    {characterProfile.name_en}
                                </span>
                            </h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-text-light-secondary mb-1">Ability</h4>
                                <p className="font-bold text-text-light-primary dark:text-text-dark-primary">
                                    {characterProfile.ability}
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-text-light-secondary mb-1">Bio</h4>
                                <p className="text-sm text-text-light-primary dark:text-text-dark-primary leading-relaxed">
                                    {characterProfile.bio}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-text-light-secondary mb-1">Appearance</h4>
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary italic">
                                    {characterProfile.appearance}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md shrink-0 flex justify-between items-center rounded-b-3xl">
          <button
            onClick={handleBack}
            disabled={currentCard === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-text-light-secondary hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-0 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            戻る
          </button>
          
          {currentCard < 5 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentCard === 1 && !isCard1Valid) ||
                (currentCard === 2 && !isCard2Valid) ||
                (currentCard === 3 && !isCard3Valid) ||
                (currentCard === 4 && !isCard4Valid)
              }
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform active:scale-95"
            >
              次へ
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isCard5Valid || loading || !characterProfile}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform active:scale-95"
            >
              {loading ? '保存中...' : '完了して始める'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
