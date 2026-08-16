/** Erreurs HTTP typées pour les server functions (évite le 500 générique). */
export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export function unauthorized(message = "Connexion requise.") {
  return new HttpError(401, message);
}

export function forbidden(message = "Accès refusé.") {
  return new HttpError(403, message);
}

export function badRequest(message: string) {
  return new HttpError(400, message);
}

export function gone(message: string) {
  return new HttpError(410, message);
}
