/**
 * useDenmarkOnly
 * Checks visitor's country via ip-api.com (free, no key, ~100ms).
 * Returns:
 *   isAllowed  — true once confirmed Denmark, false if another country
 *   isPending  — true while the check is in flight
 *   country    — the detected country name (for the blocked message)
 */

type Status = 'pending' | 'allowed' | 'blocked'

const status = ref<Status>('pending')
const country = ref('')
let checked = false

export function useDenmarkOnly() {
  if (import.meta.client && !checked) {
    checked = true
    fetch('http://ip-api.com/json/?fields=16387')
      .then((r) => r.json())
      .then((data) => {
        country.value = data.country ?? 'your country'
        status.value = data.countryCode === 'DK' ? 'allowed' : 'blocked'
      })
      .catch(() => {
        // On error, allow through — don't punish users for network issues
        status.value = 'allowed'
      })
  }

  const isPending = computed(() => status.value === 'pending')
  const isAllowed = computed(() => status.value === 'allowed')
  const isBlocked = computed(() => status.value === 'blocked')

  return { isPending, isAllowed, isBlocked, country }
}
