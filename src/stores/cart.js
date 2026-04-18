import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const sneakyItems = [
  {
    id: 'prime',
    name: 'LolBuy Prime Membership',
    subtitle: 'Required for checkout',
    price: 19.99,
    recurring: '/mo',
    checked: true,
    icon: '👑',
    guiltMessage: 'Are you sure? You\'ll lose access to our exclusive deals you\'ve never used!',
  },
  {
    id: 'damage',
    name: 'Accidental Damage Protection™',
    subtitle: 'Covers everything, probably',
    price: 12.99,
    recurring: '/mo',
    checked: true,
    icon: '🛡️',
    guiltMessage: 'Your equipment will be completely unprotected 😢 What if you sneeze near it?',
  },
  {
    id: 'delivery',
    name: 'White Glove Delivery Experience',
    subtitle: 'Someone named Gerald will deliver this personally',
    price: 49.99,
    recurring: null,
    checked: true,
    icon: '🧤',
    guiltMessage: 'Gerald will be devastated. He\'s been training for this delivery.',
  },
]

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const sneakyChecked = ref({ prime: true, damage: true, delivery: true })

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const sneakyTotal = computed(() =>
    sneakyItems.reduce((sum, s) => {
      if (sneakyChecked.value[s.id]) return sum + s.price
      return sum
    }, 0)
  )

  const total = computed(() => subtotal.value + sneakyTotal.value)

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  function addItem(product) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeItem(id) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      if (quantity <= 0) removeItem(id)
      else item.quantity = quantity
    }
  }

  function setSneaky(id, val) {
    sneakyChecked.value[id] = val
  }

  return { items, sneakyChecked, subtotal, sneakyTotal, total, itemCount, addItem, removeItem, updateQuantity, setSneaky }
})
