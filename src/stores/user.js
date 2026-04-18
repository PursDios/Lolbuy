import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fakeNames, fakeLastNames, fakeAddresses } from '../data/products.js'

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const useUserStore = defineStore('user', () => {
  const firstName = ref(pick(fakeNames))
  const lastName = ref(pick(fakeLastNames))
  const fullName = ref(`${firstName.value} ${lastName.value}`)
  const address = ref(pick(fakeAddresses))
  const email = ref(`${firstName.value.toLowerCase()}@${pick(['gmail', 'hotmail', 'yahoo', 'aol'])}.com`)

  // Debra's borrowed card
  const debraCard = ref({
    name: 'Debra Johnson',
    number: '**** **** **** 4829',
    expiry: '09/27',
    cvv: '***',
  })

  function reroll() {
    firstName.value = pick(fakeNames)
    lastName.value = pick(fakeLastNames)
    fullName.value = `${firstName.value} ${lastName.value}`
    address.value = pick(fakeAddresses)
    email.value = `${firstName.value.toLowerCase()}@${pick(['gmail', 'hotmail', 'yahoo', 'aol'])}.com`
  }

  return { firstName, lastName, fullName, address, email, debraCard, reroll }
})
