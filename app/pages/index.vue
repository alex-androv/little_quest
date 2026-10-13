<script setup lang="ts">
type Offer = {
  id: 'monthly' | 'yearly'
  name: string
  price: string
  period: string
  description: string
  badge: string | null
  billing: string
}

const { data, pending: offersPending, error: offersError, refresh } = await useFetch<{ offers: Offer[] }>('/api/offers')
const selectedOffer = ref<'monthly' | 'yearly'>('yearly')
const deviceId = ref('')
const purchasing = ref(false)
const restoring = ref(false)
const errorMessage = ref('')
const success = ref(false)
const restoreMessage = ref('')

onMounted(() => {
  const key = 'little-quest-device-id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = `device_${crypto.randomUUID()}`
    localStorage.setItem(key, id)
  }
  deviceId.value = id
})

const chosenOffer = computed(() => data.value?.offers.find((offer) => offer.id === selectedOffer.value))

async function purchase() {
  if (!deviceId.value || purchasing.value) return
  purchasing.value = true
  errorMessage.value = ''
  restoreMessage.value = ''
  try {
    await $fetch('/api/purchase', {
      method: 'POST',
      body: { offerId: selectedOffer.value, deviceId: deviceId.value }
    })
    success.value = true
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Something went wrong. Please try again.'
  } finally {
    purchasing.value = false
  }
}

async function restorePurchases() {
  if (!deviceId.value || restoring.value) return
  restoring.value = true
  errorMessage.value = ''
  restoreMessage.value = ''
  try {
    const result = await $fetch<{ purchases: { offerId: string; purchasedAt: string }[] }>('/api/restore', {
      method: 'POST',
      body: { deviceId: deviceId.value }
    })
    if (result.purchases.length) {
      success.value = true
      restoreMessage.value = `Found ${result.purchases.length} purchase${result.purchases.length === 1 ? '' : 's'} on this device.`
    } else {
      restoreMessage.value = 'No purchases found for this device yet.'
    }
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Could not restore purchases. Please try again.'
  } finally {
    restoring.value = false
  }
}

function startOver() {
  success.value = false
  restoreMessage.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <main class="relative mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col overflow-hidden bg-cream px-5 pb-6 pt-[max(22px,env(safe-area-inset-top))]">
    <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lemon/50 blur-2xl" />
    <div class="pointer-events-none absolute -left-24 top-[330px] h-48 w-48 rounded-full bg-mint/70 blur-2xl" />

    <header class="relative flex items-center justify-center gap-2">
      <div class="grid h-9 w-9 place-items-center rounded-2xl bg-violet text-lg text-white shadow-md">✦</div>
      <span class="text-sm font-black tracking-[0.12em] text-ink">LITTLE QUEST</span>
    </header>

    <section v-if="success" class="relative flex flex-1 flex-col items-center justify-center py-10 text-center">
      <div class="mb-6 grid h-28 w-28 place-items-center rounded-[2rem] bg-mint text-6xl shadow-card">🎉</div>
      <p class="mb-2 text-xs font-black uppercase tracking-[0.22em] text-violet">Hooray!</p>
      <h1 class="max-w-[300px] text-[32px] font-black leading-tight tracking-tight">Your adventure is unlocked!</h1>
      <p class="mt-3 max-w-[280px] text-sm leading-6 text-ink/65">All the stories, games and magical moments are ready for you.</p>
      <p v-if="restoreMessage" class="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink/70">{{ restoreMessage }}</p>
      <button class="mt-8 min-h-14 w-full rounded-2xl bg-violet px-5 font-black text-white shadow-[0_6px_0_#5b49c8] transition active:translate-y-1 active:shadow-none" @click="startOver">
        Back to plans
      </button>
    </section>

    <template v-else>
      <section class="relative pt-7 text-center">
        <div class="mx-auto mb-3 flex h-[132px] w-[170px] items-center justify-center">
          <svg viewBox="0 0 180 140" class="h-full w-full" role="img" aria-label="A friendly magical fox with stars">
            <path d="M34 113c-15-8-19-24-8-34 8-7 18-4 23 3-3-20 9-38 25-47l9 24 19-1 13-22c19 12 30 30 27 49 11-6 23-1 25 10 3 14-12 24-28 19-13 12-35 17-57 10-17 5-35 0-48-11Z" fill="#ffb36b"/>
            <path d="m54 47 20-24 10 34M111 53l22-26 5 39" fill="#ff786b" stroke="#29294a" stroke-width="3" stroke-linejoin="round"/>
            <path d="M62 78c0-20 13-32 29-32s31 13 31 33c0 23-14 38-31 38S62 101 62 78Z" fill="#fff1d9"/>
            <path d="M78 78h1m23 0h1" stroke="#29294a" stroke-width="5" stroke-linecap="round"/>
            <path d="M86 88q5 5 10 0" fill="none" stroke="#29294a" stroke-width="3" stroke-linecap="round"/>
            <path d="m20 34 4 9 10 2-8 6 1 10-7-7-9 4 4-9-6-7 10 1Z" fill="#7764e8"/>
            <path d="m151 13 4 8 9 2-7 6 1 9-7-6-8 4 4-9-6-7 9 1Z" fill="#ffcf4e"/>
            <circle cx="149" cy="91" r="4" fill="#7764e8"/><circle cx="44" cy="20" r="3" fill="#ff786b"/>
            <path d="M42 112q-7 7-13 0m103 5q7 5 12-1" fill="none" stroke="#29294a" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="mb-2 text-[11px] font-black uppercase tracking-[0.25em] text-violet">A world of wonder awaits</p>
        <h1 class="mx-auto max-w-[330px] text-[34px] font-black leading-[1.06] tracking-[-0.04em]">Little minds.<br><span class="text-violet">Big adventures.</span></h1>
        <p class="mx-auto mt-3 max-w-[300px] text-[14px] font-semibold leading-5 text-ink/65">Unlock every story, playful puzzle and magical discovery.</p>
      </section>

      <section class="relative mt-6 space-y-3" aria-label="Choose a plan">
        <p class="px-1 text-xs font-extrabold uppercase tracking-[0.16em] text-ink/50">Choose your plan</p>
        <div v-if="offersPending" class="space-y-3">
          <div v-for="n in 2" :key="n" class="h-[100px] animate-pulse rounded-2xl bg-white/80" />
        </div>
        <div v-else-if="offersError" class="rounded-2xl border border-coral/30 bg-white p-4 text-sm">
          <p class="font-bold text-ink">We couldn't load the plans.</p>
          <button class="mt-2 font-extrabold text-violet underline" @click="refresh()">Try again</button>
        </div>
        <button
          v-for="offer in data?.offers"
          :key="offer.id"
          class="relative flex min-h-[100px] w-full items-center gap-3 rounded-[22px] border-2 px-4 py-4 text-left transition duration-150"
          :class="selectedOffer === offer.id ? 'border-violet bg-white shadow-selected' : 'border-white bg-white/70 shadow-card'"
          :aria-pressed="selectedOffer === offer.id"
          @click="selectedOffer = offer.id"
        >
          <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2" :class="selectedOffer === offer.id ? 'border-violet bg-violet text-white' : 'border-ink/20 bg-white'">
            <span v-if="selectedOffer === offer.id" class="text-sm leading-none">✓</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-2">
              <span class="text-[16px] font-black">{{ offer.name }}</span>
              <span v-if="offer.badge" class="rounded-full bg-lemon px-2 py-1 text-[9px] font-black tracking-wide text-ink">{{ offer.badge }}</span>
            </span>
            <span class="mt-1 block text-xs font-semibold text-ink/50">{{ offer.description }}</span>
            <span class="mt-1 block text-[10px] font-extrabold text-ink/40">{{ offer.billing }}</span>
          </span>
          <span class="shrink-0 text-right">
            <span class="block text-[21px] font-black leading-tight tracking-tight">{{ offer.price }}</span>
            <span class="text-[10px] font-bold text-ink/45">{{ offer.period }}</span>
          </span>
        </button>
      </section>

      <section class="relative mt-auto pt-6">
        <div class="mb-4 flex items-center justify-center gap-4 text-[11px] font-extrabold text-ink/55">
          <span class="flex items-center gap-1.5"><span class="text-violet">✦</span> 100+ activities</span>
          <span class="flex items-center gap-1.5"><span class="text-coral">♥</span> Kid-friendly</span>
        </div>
        <p v-if="errorMessage" role="alert" class="mb-3 rounded-xl border border-coral/30 bg-white px-3 py-2 text-center text-xs font-bold text-[#c7473e]">{{ errorMessage }}</p>
        <button
          class="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-coral px-5 text-[16px] font-black text-white shadow-button transition active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="purchasing || offersPending || !chosenOffer"
          @click="purchase"
        >
          <svg v-if="purchasing" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity=".25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          {{ purchasing ? 'Unlocking your magic…' : 'Unlock all adventures' }}
          <span v-if="!purchasing" aria-hidden="true">→</span>
        </button>
        <p class="mt-3 text-center text-[10px] font-semibold leading-4 text-ink/45">Demo purchase · No real payment will be taken</p>
        <button class="mx-auto mt-3 block min-h-10 px-4 text-xs font-extrabold text-ink/55 underline decoration-ink/25 underline-offset-4 disabled:opacity-50" :disabled="restoring" @click="restorePurchases">
          {{ restoring ? 'Checking purchases…' : 'Restore purchases' }}
        </button>
        <p class="mt-1 text-center text-[9px] font-semibold text-ink/35">Made for curious little explorers ✨</p>
      </section>
    </template>
  </main>
</template>