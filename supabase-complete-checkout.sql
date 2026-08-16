-- ============================================================
-- À exécuter dans Supabase : SQL Editor > New query > Run
-- Crée la fonction utilisée par /api/checkout (paiement test)
-- ============================================================

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

-- Rafraîchir le cache API Supabase (optionnel)
NOTIFY pgrst, 'reload schema';
