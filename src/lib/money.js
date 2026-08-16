export function formatFcfa(amount, { withLabel = true } = {}) {
  const value = Number(amount || 0)
  const formatted = value.toLocaleString('fr-FR')
  return withLabel ? `${formatted} FCFA` : formatted
}
