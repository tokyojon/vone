-- Sample Data for Oneness Kingdom
-- Run this AFTER running supabase-schema-complete.sql
-- This will create sample data for testing

-- Note: Replace 'YOUR_USER_ID' with actual user IDs from auth.users table

-- Sample marketplace listings
INSERT INTO public.marketplace_listings (user_id, title, description, category, status) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'Need help with garden design', 'Looking for someone to help design my backyard garden. I have a small space and want to create a zen-style garden.', 'gardening', 'active'),
  ((SELECT id FROM auth.users LIMIT 1), 'Looking for a Japanese tutor', 'Want to learn conversational Japanese. Beginner level, prefer 2 lessons per week.', 'tutoring', 'active'),
  ((SELECT id FROM auth.users LIMIT 1), 'Dog walker needed for weekday afternoons', 'Need someone to walk my golden retriever during weekday afternoons, around 2-3 PM.', 'pets', 'active'),
  ((SELECT id FROM auth.users LIMIT 1), 'Help moving a sofa', 'Need help moving a heavy sofa to my new apartment. Should take about 1-2 hours.', 'manual_labor', 'active'),
  ((SELECT id FROM auth.users LIMIT 1), 'Seeking a photographer for a small event', 'Looking for a photographer for a small family gathering. About 20 people, 2-3 hours.', 'photography', 'active'),
  ((SELECT id FROM auth.users LIMIT 1), 'Website design consultation', 'Need consultation on improving my small business website UX and design.', 'web_design', 'active'),
  ((SELECT id FROM auth.users LIMIT 1), 'Need someone to assemble IKEA furniture', 'Bought several IKEA furniture pieces and need help assembling them.', 'manual_labor', 'active'),
  ((SELECT id FROM auth.users LIMIT 1), 'Requesting a hand-made birthday cake', 'Looking for someone to bake a custom birthday cake for my daughter. Chocolate preferred.', 'cooking', 'active');

-- Sample wallet transactions (after user signup)
INSERT INTO public.wallet_transactions (user_id, transaction_type, currency_type, amount, description) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'login_bonus', 'WNP', 5, 'ログインボーナス'),
  ((SELECT id FROM auth.users LIMIT 1), 'gift', 'WNP', 500, '中村 優太さんからギフト'),
  ((SELECT id FROM auth.users LIMIT 1), 'like', 'WNP', 10, '投稿への「いいね！」'),
  ((SELECT id FROM auth.users LIMIT 1), 'task_completion', 'WNP', 50, 'タスク完了ボーナス'),
  ((SELECT id FROM auth.users LIMIT 1), 'exchange', 'WNP', -1000, 'ONTへの変換');

-- Sample user activities
INSERT INTO public.activities (user_id, activity_type, description, points_earned) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'photo_uploaded', '新しい写真を投稿しました', 10),
  ((SELECT id FROM auth.users LIMIT 1), 'community_joined', '「東京ハイキングクラブ」コミュニティに参加しました', 5),
  ((SELECT id FROM auth.users LIMIT 1), 'challenge_completed', 'チャレンジ「ウィークリーフォト」を完了しました', 20),
  ((SELECT id FROM auth.users LIMIT 1), 'skill_added', '新しいスキル「写真編集」を追加しました', 5);

-- Update user points based on transactions
UPDATE public.profiles 
SET 
  wnp_points = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.wallet_transactions 
    WHERE user_id = profiles.id AND currency_type = 'WNP'
  ),
  ont_tokens = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.wallet_transactions 
    WHERE user_id = profiles.id AND currency_type = 'ONT'
  ),
  contribution_points = (
    SELECT COALESCE(SUM(points_earned), 0) 
    FROM public.activities 
    WHERE user_id = profiles.id
  );

-- Sample communities
INSERT INTO public.communities (name, description, member_count, created_by) VALUES
  ('東京ハイキングクラブ', '東京周辺のハイキングを楽しむコミュニティ', 156, (SELECT id FROM auth.users LIMIT 1)),
  ('写真愛好会', '写真撮影の技術を共有し学び合うグループ', 342, (SELECT id FROM auth.users LIMIT 1)),
  ('料理教室', '家庭料理からプロの技まで、料理を楽しむコミュニティ', 89, (SELECT id FROM auth.users LIMIT 1));

-- Join user to communities
INSERT INTO public.community_members (community_id, user_id, role) VALUES
  ((SELECT id FROM public.communities WHERE name = '東京ハイキングクラブ'), (SELECT id FROM auth.users LIMIT 1), 'member'),
  ((SELECT id FROM public.communities WHERE name = '写真愛好会'), (SELECT id FROM auth.users LIMIT 1), 'member');

-- Sample skills
INSERT INTO public.user_skills (user_id, skill_name, skill_level) VALUES
  ((SELECT id FROM auth.users LIMIT 1), '写真編集', 'intermediate'),
  ((SELECT id FROM auth.users LIMIT 1), 'ハイキング', 'advanced'),
  ((SELECT id FROM auth.users LIMIT 1), '日本語', 'expert');

-- Sample posts
INSERT INTO public.posts (user_id, title, content, likes_count, comments_count) VALUES
  ((SELECT id FROM auth.users LIMIT 1), '週末のハイキング', '高尾山に行ってきました！天気も良くて最高でした。', 45, 12),
  ((SELECT id FROM auth.users LIMIT 1), '新しいカメラ購入', 'ついに念願のミラーレスカメラを購入しました。週末が楽しみです！', 38, 8),
  ((SELECT id FROM auth.users LIMIT 1), '手作りパン', '初めてパンを焼いてみました。焼きたては格別ですね。', 52, 15);

-- Update profile stats
UPDATE public.profiles SET
  posts_count = (SELECT COUNT(*) FROM public.posts WHERE user_id = profiles.id),
  reviews_posted = (SELECT COUNT(*) FROM public.posts WHERE user_id = profiles.id),
  tasks_completed = 3,
  followers_count = 156,
  following_count = 89
WHERE id IN (SELECT id FROM auth.users);

-- Sample notifications
INSERT INTO public.notifications (user_id, from_user_id, type, message, read) VALUES
  ((SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'like', 'あなたの投稿を「いいね！」しました', false),
  ((SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'follow', 'あなたをフォローしました', false),
  ((SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'comment', 'あなたの投稿にコメントしました', true);

-- Verify data
SELECT 'Marketplace Listings:' as table_name, COUNT(*) as count FROM public.marketplace_listings
UNION ALL
SELECT 'Wallet Transactions:', COUNT(*) FROM public.wallet_transactions
UNION ALL
SELECT 'Activities:', COUNT(*) FROM public.activities
UNION ALL
SELECT 'Communities:', COUNT(*) FROM public.communities
UNION ALL
SELECT 'User Skills:', COUNT(*) FROM public.user_skills
UNION ALL
SELECT 'Posts:', COUNT(*) FROM public.posts
UNION ALL
SELECT 'Notifications:', COUNT(*) FROM public.notifications;
