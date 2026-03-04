-- Site settings table
CREATE TABLE site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Service role full access site_settings" ON site_settings FOR ALL USING (true);

-- Trigger updated_at
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed initial data
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('hero_banner', '{
    "title": "Vista a camisa do seu time",
    "subtitle": "Camisas oficiais de NBA, NFL, MLB, NHL e Futebol. Qualidade premium com entrega para todo Brasil.",
    "cta_text": "Explorar Catálogo",
    "cta_link": "/catalogo",
    "background_image": null
  }'::jsonb),
  ('promo_banner', '{
    "title": "Até 40% OFF na coleção Retro",
    "subtitle": "Camisas clássicas que marcaram época. Michael Jordan, Ronaldo, Kobe Bryant e muito mais.",
    "badge_text": "Oferta por tempo limitado",
    "cta_text": "Ver Coleção Retro",
    "cta_link": "/catalogo/retro",
    "background_image": null
  }'::jsonb),
  ('theme_colors', '{
    "primary": "#6C5CE7",
    "primary_dark": "#5A4BD1",
    "primary_light": "#A29BFE",
    "accent": "#FF6B6B",
    "success": "#00B894",
    "warning": "#FDCB6E",
    "info": "#0984E3",
    "bg": "#F8F9FE",
    "bg_elevated": "#FFFFFF",
    "bg_sunken": "#F1F2F6",
    "card": "#FFFFFF",
    "text": "#2D3436",
    "text_secondary": "#636E72",
    "text_muted": "#B2BEC3"
  }'::jsonb);
