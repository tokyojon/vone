import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] to-white">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#c89968] rounded"></div>
              <span className="text-xl font-semibold text-gray-900">ワンネスキングダム</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">機能</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">料金</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">会社概要</a>
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">ログイン</Link>
              <Link 
                href="/auth" 
                className="px-6 py-2 bg-[#c89968] text-white rounded-lg hover:bg-[#b8895a] transition"
              >
                登録
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              愛と貢献のメタソーシャルプラットフォーム
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              私たちは、価値が経済力や軍事力ではなく、愛とつながりによって定義される新しい国際コミュニティ国家を構築しています。
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link 
                href="/auth"
                className="px-8 py-4 bg-[#d97706] text-white text-lg font-medium rounded-lg hover:bg-[#c89968] transition shadow-lg"
              >
                今すぐ始める
              </Link>
              <a 
                href="#features"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-medium rounded-lg hover:border-gray-400 transition"
              >
                詳しく見る
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              市民になる方法
            </h2>
            <p className="text-lg text-gray-600">
              ワンネスキングダムでの旅を始めるには、これらの簡単な手順に従ってください。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#7dd3fc] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">アカウントを登録</h3>
              <p className="text-gray-600">
                あなたのプロフィールを作成し、ワンネスへの旅を始めましょう。
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#7dd3fc] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">AIによる認証</h3>
              <p className="text-gray-600">
                高度なAI認証プロセスであなたの身元を保護します。
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#7dd3fc] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">貢献し、繁栄する</h3>
              <p className="text-gray-600">
                コミュニティと関わり、あなたの才能を分かち合い、王国の中で成長してください。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#f5f5f0] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">貢献とつながり</h3>
              <p className="text-gray-600 mb-4">
                あなたの愛、学び、貢献の行動は、私たちのコミュニティ内で価値化され提唱されます。
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#f5f5f0] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">ヒューマンネットワークの構築</h3>
              <p className="text-gray-600 mb-4">
                フォロー、評価、推薦を通じて有意義な関係を築き、デジタルな家族の絆をも形成します。
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#f5f5f0] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">AIを活用したコミュニティ</h3>
              <p className="text-gray-600 mb-4">
                私たちのプラットフォームは、公正なマッチング、推薦、そして私たちの王国の安全と調和を確保するためにAIを使用しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#d97706] to-[#c89968] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4">OP制度</h2>
          <p className="text-xl mb-8">
            愛・平和・調和・貢献を基準に、会員が提供・共有・成長を通じてポイント（価値）を循環させる仕組みです。
          </p>
          <Link 
            href="/auth"
            className="inline-block px-8 py-4 bg-white text-[#d97706] text-lg font-medium rounded-lg hover:bg-gray-100 transition shadow-lg"
          >
            今すぐ参加する
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#c89968] rounded"></div>
                <span className="text-lg font-semibold">ワンネスキングダム</span>
              </div>
              <p className="text-gray-400 text-sm">
                愛と貢献のメタソーシャルプラットフォーム
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">基本理念</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">使命と価値</a></li>
                <li><a href="#" className="hover:text-white">コミュニティ</a></li>
                <li><a href="#" className="hover:text-white">ビジョン</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">リソース</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">ヘルプセンター</a></li>
                <li><a href="#" className="hover:text-white">ガイド</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">法的情報</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">会社概要</a></li>
                <li><a href="#" className="hover:text-white">利用規約</a></li>
                <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Oneness Kingdom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
