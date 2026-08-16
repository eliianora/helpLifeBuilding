-- ============================================================
-- Mise à jour Supabase (base déjà en place)
-- Dashboard Supabase > SQL Editor > New query > Run
-- Ne pas exécuter tout supabase-schema.sql sur une base existante.
-- ============================================================

-- Lecture ebook : contenu paginé optionnel (sinon PDF via fichier_url)
ALTER TABLE public.ebooks
  ADD COLUMN IF NOT EXISTS contenu_pages JSONB;

-- Services : langages liés (admin)
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS langages_ids UUID[] DEFAULT '{}'::uuid[];

-- Achats / progression (si tables absentes)
CREATE TABLE IF NOT EXISTS public.ebook_achats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  utilisateur_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id UUID REFERENCES public.ebooks(id) ON DELETE CASCADE,
  paiement_id UUID REFERENCES public.paiement(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ebook_progress (
  utilisateur_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id UUID REFERENCES public.ebooks(id) ON DELETE CASCADE,
  page INTEGER DEFAULT 1,
  percent INTEGER DEFAULT 0,
  total_pages INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (utilisateur_id, ebook_id)
);

ALTER TABLE public.ebook_achats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Achats visibles par proprietaire" ON public.ebook_achats;
CREATE POLICY "Achats visibles par proprietaire" ON public.ebook_achats
  FOR SELECT USING (auth.uid() = utilisateur_id);

DROP POLICY IF EXISTS "Achats inserables par proprietaire" ON public.ebook_achats;
CREATE POLICY "Achats inserables par proprietaire" ON public.ebook_achats
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = utilisateur_id);

DROP POLICY IF EXISTS "Ebooks lisibles par acheteur" ON public.ebooks;
CREATE POLICY "Ebooks lisibles par acheteur" ON public.ebooks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.ebook_achats ea
      WHERE ea.utilisateur_id = auth.uid()
        AND ea.ebook_id = ebooks.id
    )
  );

DROP POLICY IF EXISTS "Progress visible par proprietaire" ON public.ebook_progress;
CREATE POLICY "Progress visible par proprietaire" ON public.ebook_progress
  FOR SELECT USING (auth.uid() = utilisateur_id);

DROP POLICY IF EXISTS "Progress upsert par proprietaire" ON public.ebook_progress;
CREATE POLICY "Progress upsert par proprietaire" ON public.ebook_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = utilisateur_id);

DROP POLICY IF EXISTS "Progress update par proprietaire" ON public.ebook_progress;
CREATE POLICY "Progress update par proprietaire" ON public.ebook_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = utilisateur_id)
  WITH CHECK (auth.uid() = utilisateur_id);

-- Communauté : likes et commentaires
CREATE TABLE IF NOT EXISTS public.community_post_likes (
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts communauté lisibles" ON public.community_posts;
CREATE POLICY "Posts communauté lisibles" ON public.community_posts
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Posts communauté inserables" ON public.community_posts;
CREATE POLICY "Posts communauté inserables" ON public.community_posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Posts communauté modifiables (owner)" ON public.community_posts;
CREATE POLICY "Posts communauté modifiables (owner)" ON public.community_posts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Likes communauté lisibles" ON public.community_post_likes;
CREATE POLICY "Likes communauté lisibles" ON public.community_post_likes
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Likes communauté inserables" ON public.community_post_likes;
CREATE POLICY "Likes communauté inserables" ON public.community_post_likes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Likes communauté supprimables" ON public.community_post_likes;
CREATE POLICY "Likes communauté supprimables" ON public.community_post_likes
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Commentaires communauté lisibles" ON public.community_comments;
CREATE POLICY "Commentaires communauté lisibles" ON public.community_comments
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Commentaires communauté inserables" ON public.community_comments;
CREATE POLICY "Commentaires communauté inserables" ON public.community_comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Commentaires communauté supprimables" ON public.community_comments;
CREATE POLICY "Commentaires communauté supprimables" ON public.community_comments
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT ON TABLE public.community_posts TO anon, authenticated;
GRANT INSERT, UPDATE ON TABLE public.community_posts TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.community_post_likes TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.community_comments TO authenticated;

CREATE OR REPLACE FUNCTION public.sync_community_post_like_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.community_posts
  SET likes = (
    SELECT COUNT(*) FROM public.community_post_likes
    WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS community_post_likes_sync ON public.community_post_likes;
CREATE TRIGGER community_post_likes_sync
  AFTER INSERT OR DELETE ON public.community_post_likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_community_post_like_count();

CREATE OR REPLACE FUNCTION public.toggle_community_post_like(p_post_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.community_post_likes
    WHERE post_id = p_post_id AND user_id = auth.uid()
  ) THEN
    DELETE FROM public.community_post_likes
    WHERE post_id = p_post_id AND user_id = auth.uid();
  ELSE
    INSERT INTO public.community_post_likes (post_id, user_id)
    VALUES (p_post_id, auth.uid());
  END IF;

  SELECT likes INTO next_count FROM public.community_posts WHERE id = p_post_id;
  RETURN COALESCE(next_count, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_community_post_like(uuid) TO authenticated;

-- ============================================================
-- SÉCURITÉ : paiements / achats / rôle utilisateur
-- ============================================================

DROP POLICY IF EXISTS "Utilisateurs peuvent creer leurs paiements" ON public.paiement;
DROP POLICY IF EXISTS "Utilisateurs peuvent modifier leurs paiements" ON public.paiement;
DROP POLICY IF EXISTS "Achats inserables par proprietaire" ON public.ebook_achats;

DROP POLICY IF EXISTS "Admins gerent paiements" ON public.paiement;
CREATE POLICY "Admins gerent paiements" ON public.paiement
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.prevent_self_admin_role()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_prevent_role_escalation ON public.users;
CREATE TRIGGER users_prevent_role_escalation
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_admin_role();

CREATE OR REPLACE FUNCTION public.complete_checkout(
  p_moyen text,
  p_ebook_ids uuid[],
  p_nom_client text DEFAULT NULL,
  p_email_client text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_commande_id uuid;
  v_paiement_id uuid;
  v_montant numeric := 0;
  v_items jsonb := '[]'::jsonb;
  v_row record;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_ebook_ids IS NULL OR array_length(p_ebook_ids, 1) IS NULL THEN
    RAISE EXCEPTION 'Panier vide';
  END IF;

  FOR v_row IN
    SELECT e.id, e.titre, e.prix
    FROM public.ebooks e
    WHERE e.id = ANY(p_ebook_ids)
      AND e.statut = 'publie'
  LOOP
    v_montant := v_montant + COALESCE(v_row.prix, 0);
    v_items := v_items || jsonb_build_array(
      jsonb_build_object(
        'ebook_id', v_row.id,
        'titre', v_row.titre,
        'prix', v_row.prix
      )
    );
  END LOOP;

  IF jsonb_array_length(v_items) = 0 THEN
    RAISE EXCEPTION 'Aucun ebook valide';
  END IF;

  INSERT INTO public.commandes (user_id, nom_client, email_client, items, montant_total, statut)
  VALUES (v_user, p_nom_client, p_email_client, v_items, v_montant, 'payee')
  RETURNING id INTO v_commande_id;

  INSERT INTO public.paiement (utilisateur_id, commande_id, montant, devise, moyen, statut, items)
  VALUES (v_user, v_commande_id, v_montant, 'XOF', p_moyen, 'paid', v_items)
  RETURNING id INTO v_paiement_id;

  INSERT INTO public.ebook_achats (utilisateur_id, ebook_id, paiement_id)
  SELECT v_user, (item->>'ebook_id')::uuid, v_paiement_id
  FROM jsonb_array_elements(v_items) AS item;

  RETURN jsonb_build_object(
    'commande_id', v_commande_id,
    'paiement_id', v_paiement_id,
    'montant', v_montant
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_checkout(text, uuid[], text, text) TO authenticated;
