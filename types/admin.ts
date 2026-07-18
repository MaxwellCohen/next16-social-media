export type ActivityKind = 'drop' | 'reply' | 'like' | 'repost';

export type TrendingTag = { name: string; count: number };

export type TopDrop = {
  id: string;
  authorHandle: string;
  preview: string;
  likes: number;
  reposts: number;
  score: number;
};

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  actorHandle: string;
  preview?: string;
  at: number;
};

export type SeriesPoint = { t: number; count: number };

export type AdminSnapshot = {
  totals: { drops: number; replies: number; users: number; likes: number; reposts: number };
  dropsLastMinute: number;
  series: SeriesPoint[];
  trending: TrendingTag[];
  topDrops: TopDrop[];
  recentActivity: ActivityItem[];
  presence: number;
  computedAt: number;
};

export type ServerMessage =
  | { type: 'snapshot'; snapshot: AdminSnapshot }
  | { type: 'activity'; item: ActivityItem }
  | { type: 'presence'; presence: number };

export type ConnectionStatus = 'connecting' | 'live' | 'reconnecting' | 'offline';
