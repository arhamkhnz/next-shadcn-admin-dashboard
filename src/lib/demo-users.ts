/**
 * Génère un tableau d'utilisateurs factices pour le mode démo.
 */

const firstNames = [
  "Emma", "Noah", "Liam", "Olivia", "Ava", "Sophia", "Mia", "Isabella",
  "Lucas", "Ethan", "James", "Amelia", "Charlotte", "Benjamin", "Logan",
  "Harper", "Daniel", "Chloe", "Jackson", "Evelyn"
]

const lastNames = [
  "Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson",
  "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Lee"
]

const roles = ["Admin", "Editor", "Viewer"]
const statuses = ["Active", "Pending", "Suspended"]

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateDemoUsers(count = 25) {
  const users = []

  for (let i = 1; i <= count; i++) {
    const first = random(firstNames)
    const last = random(lastNames)
    const name = `${first} ${last}`
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`

    users.push({
      id: i,
      name,
      email,
      role: random(roles),
      status: random(statuses),
    })
  }

  return users
}
