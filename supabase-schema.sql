-- ========================================
-- SCRIPT SQL POUR SUPABASE
-- ========================================
-- Exécute ce script dans l'éditeur SQL de Supabase
-- (Dashboard > SQL Editor > New Query)

-- ========================================
-- TABLE: EBOOKS
-- ========================================

-- Table Categorie_eb
CREATE TABLE categorie_eb (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE ebooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    prix_original DECIMAL(10,2),
    categorie_eb_id UUID REFERENCES categorie_eb(id), -- Optionnel: lie au panier/commande
    image_url TEXT,
    fichier_url TEXT,
    contenu_pages JSONB,
    auteur VARCHAR(255),
    pages INTEGER,
    notation DECIMAL(2,1) DEFAULT 0,
    nombre_avis INTEGER DEFAULT 0,
    ventes INTEGER DEFAULT 0,
    bestseller BOOLEAN DEFAULT FALSE,
    statut VARCHAR(50) DEFAULT 'brouillon',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLE: SERVICES
-- ========================================
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2),
    unite VARCHAR(50) DEFAULT 'heure',
    icone VARCHAR(50),
    couleur VARCHAR(100),
    features JSONB,
    populaire BOOLEAN DEFAULT FALSE,
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    langages_ids UUID[] DEFAULT '{}'::uuid[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLE: PORTFOLIO
-- ========================================


CREATE TABLE categorie_pro (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE langages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    categorie_pro_id UUID REFERENCES categorie_pro(id), -- Optionnel: lie au panier/commande
    langages_id UUID REFERENCES langages(id), -- Optionnel: lie au panier/commande
    image_url TEXT,
    lien_demo TEXT,
    lien_github TEXT,
    ordre INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLE: PROJET (si tu veux séparer de portfolio)
-- ========================================
CREATE TABLE projet (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    icon TEXT,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    categorie_pro_id UUID REFERENCES categorie_pro(id),
    langages_ids UUID[] DEFAULT '{}'::uuid[],
    statut VARCHAR(50) DEFAULT 'brouillon',
    ordre INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================
-- TABLE: RENDEZ-VOUS
-- ========================================
CREATE TABLE rendez_vous (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES services(id),
    nom_client VARCHAR(255) NOT NULL,
    email_client VARCHAR(255) NOT NULL,
    telephone VARCHAR(50),
    message TEXT,
    date_rdv DATE NOT NULL,
    heure_rdv TIME NOT NULL,
    duree INTEGER DEFAULT 60,
    statut VARCHAR(50) DEFAULT 'en_attente',
    notes_admin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLE: BANDE DÉFILANTE
-- ========================================
CREATE TABLE bande_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) DEFAULT 'text',
    contenu TEXT NOT NULL,
    media_url TEXT,
    lien TEXT,
    actif BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ALTER TABLE bande_info ADD COLUMN status BOOLEAN DEFAULT TRUE;

-- ========================================
-- TABLE: NEWSLETTER
-- ========================================
CREATE TABLE newsletter (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(255),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actif BOOLEAN DEFAULT TRUE
);

-- ========================================
-- TABLE: UTILISATEURS (étendue)
-- ========================================
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'client',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLE: POSTS COMMUNAUTÉ
-- ========================================
CREATE TABLE community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    contenu TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE community_post_likes (
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE community_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contenu TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLE: COMMANDES
-- ========================================
CREATE TABLE commandes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    email_client VARCHAR(255),
    nom_client VARCHAR(255),
    items JSONB NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente',
    stripe_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Si la table existe déjà et que tu dois corriger la FK en prod:
-- ALTER TABLE public.commandes DROP CONSTRAINT IF EXISTS commandes_user_id_fkey;
-- ALTER TABLE public.commandes
--   ADD CONSTRAINT commandes_user_id_fkey
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ========================================
-- DONNÉES DE DÉMONSTRATION
-- ========================================

-- Ebooks
-- Services
INSERT INTO services (titre, description, prix, unite, populaire, ordre) VALUES
('Coaching Personnel', 'Accompagnement sur-mesure pour atteindre vos objectifs.', 80, 'heure', FALSE, 1),
('Formation Entreprise', 'Programmes de formation pour vos équipes.', NULL, 'Sur devis', TRUE, 2),
('Consultation Stratégique', 'Analyse et recommandations pour votre business.', 150, 'heure', FALSE, 3);

-- Bande Info
INSERT INTO bande_info (type, contenu, lien, actif, ordre) VALUES
('text', '🎉 Nouveau ! Découvrez notre collection d''ebooks', '/ebooks', TRUE, 1),
('text', '📅 Prenez rendez-vous et bénéficiez de -20%', '/rdv', TRUE, 2),
('text', '⭐ Plus de 500 clients satisfaits !', '/communaute', TRUE, 3);

-- ========================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- ========================================

-- Activer RLS sur toutes les tables
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE projet ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;
ALTER TABLE bande_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Helper: est admin ?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'admin'
  );
$$;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;

-- Politique: Lecture publique pour les ebooks publiés
CREATE POLICY "Ebooks publics lisibles" ON ebooks
    FOR SELECT USING (statut = 'publie');

-- Lecture pour acheteurs (même si pas encore publié)
-- NOTE: cette policy dépend de la table `ebook_achats` (créée plus bas).
-- Elle est donc définie plus bas, après la création de `ebook_achats`.

-- Admin simple (utilisateur connecté) : CRUD sur contenu
-- (À remplacer par une vraie gestion de rôle admin si besoin)
CREATE POLICY "Ebooks modifiables (auth)" ON ebooks
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Droits SQL (en plus des policies RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ebooks TO authenticated;

-- Politique: Lecture publique pour les services actifs
CREATE POLICY "Services actifs lisibles" ON services
    FOR SELECT USING (actif = TRUE);

CREATE POLICY "Services modifiables (auth)" ON services
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE services TO authenticated;

-- Politique: Lecture publique pour le portfolio visible
CREATE POLICY "Portfolio visible lisible" ON portfolio
    FOR SELECT USING (visible = TRUE);

CREATE POLICY "Portfolio modifiable (auth)" ON portfolio
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE portfolio TO authenticated;

CREATE POLICY "Projet visible lisible" ON projet
    FOR SELECT USING (visible = TRUE);

CREATE POLICY "Projet modifiable (auth)" ON projet
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Politique: Lecture publique pour la bande info active
CREATE POLICY "Bande info active lisible" ON bande_info
    FOR SELECT USING (actif = TRUE);

CREATE POLICY "Bande info modifiable (auth)" ON bande_info
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Rendez-vous: création publique + lecture/modif admin simple (auth)
CREATE POLICY "Rdv creation publique" ON rendez_vous
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Rdv modifiable (auth)" ON rendez_vous
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Référentiels: lecture publique (utiles pour listes) + CRUD auth (admin simple)
CREATE POLICY "Categorie projet lisibles" ON categorie_pro FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Categorie projet modifiables (auth)" ON categorie_pro;
CREATE POLICY "Categorie projet modifiables (auth)" ON categorie_pro
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Categorie ebooks lisibles" ON categorie_eb FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Categorie ebooks modifiables (auth)" ON categorie_eb;
CREATE POLICY "Categorie ebooks modifiables (auth)" ON categorie_eb
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Langages lisibles" ON langages FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Langages modifiables (auth)" ON langages;
CREATE POLICY "Langages modifiables (auth)" ON langages
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Politique: Inscription newsletter publique
CREATE POLICY "Newsletter inscription publique" ON newsletter
    FOR INSERT WITH CHECK (TRUE);

-- Politique: Posts communauté lisibles par tous
CREATE POLICY "Posts communauté lisibles" ON community_posts
    FOR SELECT USING (TRUE);

CREATE POLICY "Posts communauté inserables" ON community_posts
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Posts communauté modifiables (owner)" ON community_posts
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Likes communauté lisibles" ON community_post_likes
    FOR SELECT USING (TRUE);

CREATE POLICY "Likes communauté inserables" ON community_post_likes
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Likes communauté supprimables" ON community_post_likes
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Commentaires communauté lisibles" ON community_comments
    FOR SELECT USING (TRUE);

CREATE POLICY "Commentaires communauté inserables" ON community_comments
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Commentaires communauté supprimables" ON community_comments
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

GRANT SELECT ON TABLE community_posts TO anon, authenticated;
GRANT INSERT, UPDATE ON TABLE community_posts TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE community_post_likes TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE community_comments TO authenticated;

CREATE OR REPLACE FUNCTION public.sync_community_post_like_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE community_posts
  SET likes = (
    SELECT COUNT(*) FROM community_post_likes WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS community_post_likes_sync ON community_post_likes;
CREATE TRIGGER community_post_likes_sync
  AFTER INSERT OR DELETE ON community_post_likes
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
    SELECT 1 FROM community_post_likes
    WHERE post_id = p_post_id AND user_id = auth.uid()
  ) THEN
    DELETE FROM community_post_likes
    WHERE post_id = p_post_id AND user_id = auth.uid();
  ELSE
    INSERT INTO community_post_likes (post_id, user_id)
    VALUES (p_post_id, auth.uid());
  END IF;

  SELECT likes INTO next_count FROM community_posts WHERE id = p_post_id;
  RETURN COALESCE(next_count, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_community_post_like(uuid) TO authenticated;

-- Users table: le user peut créer/mettre à jour son profil (sinon FK commandes -> users casse)
CREATE POLICY "Users profiles public read" ON users
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins manage users" ON users
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Commandes: l'utilisateur ne voit/crée que ses commandes
CREATE POLICY "Commandes visibles par proprietaire" ON commandes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Commandes inserables par proprietaire" ON commandes
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Commandes modifiables par proprietaire" ON commandes
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins voient toutes les commandes" ON commandes
    FOR SELECT TO authenticated
    USING (public.is_admin());

-- ========================================
-- FONCTIONS UTILES
-- ========================================
-- Table Auteurs (liée aux ebooks)
CREATE TABLE auteurs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Table Paiement (Celle qui cause l'erreur)
CREATE TABLE paiement (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilisateur_id UUID REFERENCES auth.users(id),
    commande_id UUID REFERENCES commandes(id), -- Optionnel: lie au panier/commande
    montant DECIMAL(10,2) NOT NULL,
    date_paiement TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    devise VARCHAR(10) DEFAULT 'XOF',
    moyen VARCHAR(50), 
    statut VARCHAR(50) DEFAULT 'paid',
    items JSONB
);

-- Table Panier
CREATE TABLE panier (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilisateur_id UUID REFERENCES auth.users(id),
    ebook_id UUID REFERENCES ebooks(id),
    ajoute_le TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer la sécurité (RLS)
ALTER TABLE paiement ENABLE ROW LEVEL SECURITY;
ALTER TABLE panier ENABLE ROW LEVEL SECURITY;
ALTER TABLE auteurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorie_eb ENABLE ROW LEVEL SECURITY;
ALTER TABLE langages ENABLE ROW LEVEL SECURITY;

-- Auteurs: lecture publique + CRUD auth (admin simple)
CREATE POLICY "Auteurs lisibles" ON auteurs FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Auteurs modifiables (auth)" ON auteurs;
CREATE POLICY "Auteurs modifiables (auth)" ON auteurs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Politiques de sécurité simples : l'utilisateur ne voit que ses données
CREATE POLICY "Utilisateurs voient leurs propres paiements" ON paiement
    FOR SELECT USING (auth.uid() = utilisateur_id);

-- IMPORTANT: sans policy INSERT/UPDATE, les insert échouent avec:
-- "new row violates row-level security policy"
CREATE POLICY "Utilisateurs peuvent creer leurs paiements" ON paiement
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = utilisateur_id);

CREATE POLICY "Utilisateurs peuvent modifier leurs paiements" ON paiement
    FOR UPDATE TO authenticated
    USING (auth.uid() = utilisateur_id)
    WITH CHECK (auth.uid() = utilisateur_id);

CREATE POLICY "Admins voient tous les paiements" ON paiement
    FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "Utilisateurs voient leur propre panier" ON panier
    FOR ALL USING (auth.uid() = utilisateur_id);

-- ========================================
-- ACHATS / PROGRESSION EBOOKS
-- ========================================
CREATE TABLE ebook_achats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilisateur_id UUID REFERENCES auth.users(id),
    ebook_id UUID REFERENCES ebooks(id),
    paiement_id UUID REFERENCES paiement(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ebook_progress (
    utilisateur_id UUID REFERENCES auth.users(id),
    ebook_id UUID REFERENCES ebooks(id),
    page INTEGER DEFAULT 1,
    percent INTEGER DEFAULT 0,
    total_pages INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (utilisateur_id, ebook_id)
);

ALTER TABLE ebook_achats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achats visibles par proprietaire" ON ebook_achats
    FOR SELECT USING (auth.uid() = utilisateur_id);
CREATE POLICY "Achats inserables par proprietaire" ON ebook_achats
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = utilisateur_id);

-- Ebook lisible par acheteur (même si pas publié)
DROP POLICY IF EXISTS "Ebooks lisibles par acheteur" ON ebooks;
CREATE POLICY "Ebooks lisibles par acheteur" ON ebooks
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.ebook_achats ea
        WHERE ea.utilisateur_id = auth.uid()
          AND ea.ebook_id = ebooks.id
      )
    );

CREATE POLICY "Progress visible par proprietaire" ON ebook_progress
    FOR SELECT USING (auth.uid() = utilisateur_id);
CREATE POLICY "Progress upsert par proprietaire" ON ebook_progress
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = utilisateur_id);
CREATE POLICY "Progress update par proprietaire" ON ebook_progress
    FOR UPDATE TO authenticated USING (auth.uid() = utilisateur_id) WITH CHECK (auth.uid() = utilisateur_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à toutes les tables
CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON ebooks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_rendez_vous_updated_at BEFORE UPDATE ON rendez_vous FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bande_info_updated_at BEFORE UPDATE ON bande_info FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- SUPABASE STORAGE (UPLOAD EBOOKS)
-- ========================================
-- IMPORTANT:
-- Sur Supabase, `storage.objects` appartient au système Storage.
-- Selon ton projet, l'utilisateur SQL peut NE PAS être owner => erreur:
--   "must be owner of table objects"
--
-- Donc on NE met PAS ici de `ALTER TABLE storage.objects ...` ni de policies SQL.
--
-- ✅ À faire dans l'UI Supabase:
-- 1) Dashboard -> Storage -> New bucket -> `ebooks`
-- 2) Storage -> Policies -> créer les policies pour le bucket `ebooks`:
--    - SELECT: autoriser lecture (public si bucket public, sinon authenticated)
--    - INSERT/UPDATE/DELETE: autoriser `authenticated` (pour l'admin upload)
--
-- Une fois fait, l'upload depuis l'admin (champ `fichier_url`) fonctionne.

-- ========================================
-- MIGRATIONS (bases déjà existantes)
-- ========================================
ALTER TABLE services ADD COLUMN IF NOT EXISTS langages_ids UUID[] DEFAULT '{}'::uuid[];
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS contenu_pages JSONB;

-- ========================================
-- DONNÉES DE DÉMO (CATEGORIES + EBOOKS)
-- ========================================
-- IMPORTANT:
-- - `ebooks.statut` doit être 'publie' pour être visible publiquement (policy RLS).
-- - Assure-toi d'avoir créé le bucket Storage `ebooks` si tu veux tester `fichier_url`.

INSERT INTO categorie_eb (nom) VALUES
  ('Marketing'),
  ('Business'),
  ('Développement'),
  ('Finance'),
  ('Communication')
ON CONFLICT DO NOTHING;

-- Création / promotion de comptes dans `public.users`
-- IMPORTANT: `public.users.id` doit être le UUID de `auth.users.id`.
-- Donc on insère via une jointure sur `auth.users`.

INSERT INTO public.users (id, nom, email, role)
SELECT a.id, v.nom, v.email, v.role
FROM (
  VALUES
    ('Rakbe Elia', 'elianorakbe@gmail.com', 'admin'),
    ('Kouassi Junior', 'juniorkouassi@gmail.com', 'client')
) AS v(nom, email, role)
JOIN auth.users a ON a.email = v.email
ON CONFLICT (id) DO UPDATE
SET role = EXCLUDED.role,
    nom = EXCLUDED.nom,
    email = EXCLUDED.email;

-- Profil public.users créé automatiquement à l'inscription Auth (rôle client par défaut).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, nom, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO ebooks (
  titre, description, prix, prix_original, categorie_eb_id, image_url, fichier_url,
  auteur, pages, notation, nombre_avis, ventes, bestseller, statut
)
SELECT
  v.titre,
  v.description,
  v.prix,
  v.prix_original,
  c.id,
  v.image_url,
  v.fichier_url,
  v.auteur,
  v.pages,
  v.notation,
  v.nombre_avis,
  v.ventes,
  v.bestseller,
  v.statut
FROM (
  VALUES
    (
      'Maîtrisez le Marketing Digital',
      'Guide complet pour dominer les réseaux sociaux et le SEO.',
      19990::numeric, 29990::numeric,
      'Marketing',
      'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80',
      NULL,
      'Jean Dupont',
      120,
      4.8::numeric, 234, 234, TRUE,
      'publie'
    ),
    (
      'Leadership Moderne',
      'Techniques de management pour le monde d''aujourd''hui.',
      24990::numeric, NULL,
      'Business',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      NULL,
      'Marie Martin',
      140,
      4.9::numeric, 187, 187, TRUE,
      'publie'
    ),
    (
      'Productivité Maximale',
      'Doublez votre efficacité en 30 jours.',
      14990::numeric, NULL,
      'Développement',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      NULL,
      'Pierre Durand',
      95,
      4.7::numeric, 312, 312, FALSE,
      'publie'
    )
) AS v(
  titre, description, prix, prix_original,
  categorie_nom,
  image_url, fichier_url,
  auteur, pages,
  notation, nombre_avis, ventes, bestseller,
  statut
)
JOIN categorie_eb c ON c.nom = v.categorie_nom
ON CONFLICT DO NOTHING;

-- ========================================
-- MIGRATION COMMUNAUTÉ (bases existantes)
-- ========================================
-- À exécuter sur une base déjà déployée si les likes/commentaires ne sont pas encore actifs.
--
-- CREATE TABLE IF NOT EXISTS community_post_likes (
--   post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
--   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   PRIMARY KEY (post_id, user_id)
-- );
--
-- CREATE TABLE IF NOT EXISTS community_comments (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
--   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--   contenu TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
--
-- ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
--
-- Puis recréer les policies / fonctions définies plus haut dans ce fichier.

-- ========================================
-- SCRIPT DESTRUCTIF: SUPPRIMER TOUTES LES TABLES (PUBLIC)
-- ========================================
-- ATTENTION: ce script supprime TOUTES les tables du schéma public (et dépendances via CASCADE).
-- Ne l'exécute que si tu veux repartir de zéro.
--
-- DO $$
-- DECLARE r RECORD;
-- BEGIN
--   -- drop tables
--   FOR r IN (
--     SELECT tablename
--     FROM pg_tables
--     WHERE schemaname = 'public'
--   ) LOOP
--     EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', r.tablename);
--   END LOOP;
--
--   -- drop types (enum, custom types)
--   FOR r IN (
--     SELECT t.typname
--     FROM pg_type t
--     JOIN pg_namespace n ON n.oid = t.typnamespace
--     WHERE n.nspname = 'public' AND t.typtype = 'e'
--   ) LOOP
--     EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE;', r.typname);
--   END LOOP;
-- END $$;
