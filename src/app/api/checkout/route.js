import { NextResponse } from 'next/server'

/**
 * Ancien checkout simulation — désactivé en production.
 * L'accès ebook ne peut plus être créé par le client.
 * Futur : webhook prestataire (Stripe / Mobile Money) + service role uniquement.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'CHECKOUT_DISABLED',
      message:
        "Le paiement automatique n'est pas encore branché. Contactez l'équipe pour obtenir un accès, ou utilisez l'attribution admin.",
    },
    { status: 410 },
  )
}

export async function GET() {
  return POST()
}
