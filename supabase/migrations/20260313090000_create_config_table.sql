-- Create config table for site settings
CREATE TABLE IF NOT EXISTS public.config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'GIA PHẢ HỌ NGUYỄN BỈM SƠN',
  guest_email TEXT NOT NULL DEFAULT 'guest@giapha.com',
  guest_password TEXT NOT NULL DEFAULT 'giapha@123',
  introduction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically update updated_at
CREATE TRIGGER handle_config_updated_at
  BEFORE UPDATE ON public.config
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default config row
INSERT INTO public.config (site_name, guest_email, guest_password, introduction)
VALUES (
  'GIA PHẢ HỌ NGUYỄN BỈM SƠN',
  'guest@giapha.com',
  'giapha@123',
  'Chờ cập nhật'
)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read/update config
CREATE POLICY "Admins can view config" ON public.config
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update config" ON public.config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert config" ON public.config
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Allow authenticated users to read config for guest login
CREATE POLICY "Authenticated users can read limited config" ON public.config
  FOR SELECT USING (
    auth.role() = 'authenticated'
  );
