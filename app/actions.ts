'use server'

export async function disabledButtonVerifications(
  expiration: string,
  remainingTickets: number
) {
  return expiration < Date.now().toString() || remainingTickets === 0
}
