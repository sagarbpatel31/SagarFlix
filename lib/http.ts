/**
 * Pulls the server's error message out of a failed JSON response.
 *
 * Some failures are actionable — hitting the draft cap tells the user to delete
 * something — so the server's own message is preferred over the status code
 * whenever there is one.
 */
export async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body?.error === "string" && body.error.trim().length > 0) {
      return body.error;
    }
  } catch {
    // Non-JSON or empty body — fall through to the status-based message.
  }

  return `${fallback} (${response.status}).`;
}
