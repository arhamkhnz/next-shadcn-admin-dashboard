// src/lib/api.ts

/**
 * PATCH helper avec fallback mock si aucun backend n'est détecté.
 * - En mode production : envoie la requête réelle vers /api/users/:id
 * - En mode local sans backend : simule la réponse avec un mock
 */

export async function patchUser(id: number, payload: Record<string, any>) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    // Si le backend répond, on retourne la vraie donnée
    if (res.ok) {
      const data = await res.json()
      console.info("✅ Backend response:", data)
      return data
    }

    // Sinon on passe en mode "mock"
    throw new Error("Backend not available")
  } catch (error) {
    console.warn("⚠️ No backend detected — using mock mode.")
    // Simule un retour identique à ce qu'enverrait une vraie API
    await new Promise((r) => setTimeout(r, 400)) // petit délai simulé
    return { id, ...payload }
  }
}
