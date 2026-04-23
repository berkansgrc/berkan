-- Add stream_type and daily_room_url to live_stream_config
ALTER TABLE public.live_stream_config
ADD COLUMN IF NOT EXISTS stream_type TEXT DEFAULT 'youtube' CHECK (stream_type IN ('youtube', 'daily')),
ADD COLUMN IF NOT EXISTS daily_room_url TEXT;
