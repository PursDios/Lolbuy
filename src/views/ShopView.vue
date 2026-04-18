<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="mb-10" ref="headerEl">
      <p class="tag mb-3 inline-block">ALL PRODUCTS</p>
      <h1 class="text-5xl font-black text-white mb-3">Shop Everything</h1>
      <p class="text-gray-500">{{ filteredProducts.length }} products found. All of them are <span class="text-red-400 font-medium">nearly out of stock</span>.</p>
    </div>

    <div class="flex gap-8">
      <!-- Sidebar -->
      <aside class="w-56 flex-shrink-0 hidden lg:block">
        <div class="glass rounded-2xl p-5 sticky top-24">
          <h3 class="font-bold text-white text-sm mb-4">Filter by Category</h3>
          <div class="space-y-1">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectCategory(cat)"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200"
              :class="activeCategory === cat
                ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'"
              :style="activeCategory === cat ? 'background: rgba(168,85,247,0.2); color: #a855f7' : ''"
            >
              {{ cat }}
              <span class="text-xs text-gray-700 ml-1">({{ getCategoryCount(cat) }})</span>
            </button>
          </div>

          <div class="mt-6 pt-5 border-t border-white/5">
            <h3 class="font-bold text-white text-sm mb-3">Sort By</h3>
            <select
              v-model="sortBy"
              class="input-dark text-sm"
              @change="onSortChange"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="random">Most Relevant</option>
            </select>
            <p v-if="sortChanged" class="text-[10px] text-gray-700 mt-2">
              * Sort applied. Results may appear identical to before. This is intentional.
            </p>
          </div>

          <div class="mt-6 pt-5 border-t border-white/5">
            <h3 class="font-bold text-white text-sm mb-3">Price Range</h3>
            <input
              type="range"
              min="0"
              max="2000"
              v-model="maxPrice"
              class="w-full accent-purple-500"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>${{ maxPrice }}</span>
            </div>
            <p class="text-[10px] text-gray-700 mt-2">
              Price filter is decorative at this time.
            </p>
          </div>
        </div>
      </aside>

      <!-- Products grid -->
      <div class="flex-1">
        <!-- Search bar with dark twist -->
        <div class="flex gap-3 mb-6">
          <div class="relative flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="input-dark pl-10"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">🔍</span>
          </div>
          <div class="glass rounded-xl px-4 flex items-center text-xs text-gray-500 whitespace-nowrap">
            {{ filteredProducts.length }} results
          </div>
        </div>

        <!-- Sneaky top banner -->
        <div class="glass rounded-xl px-4 py-3 mb-6 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="text-green-400">✓</span>
            <span class="text-gray-400">Free shipping on orders over $49 <span class="text-gray-600">(shipping not included)</span></span>
          </div>
          <span class="text-gray-600 text-[10px]">Hover a product for 2s to auto-add it 👀</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" ref="gridEl">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-if="filteredProducts.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">😔</div>
          <p class="text-gray-500">No products found.</p>
          <p class="text-gray-700 text-sm mt-2">We've taken the liberty of searching for you and also found nothing.</p>
          <button @click="clearFilters" class="btn-primary mt-4">Clear Filters</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { products, categories } from '../data/products.js'
import ProductCard from '../components/ProductCard.vue'
import gsap from 'gsap'

const headerEl = ref(null)
const gridEl = ref(null)
const activeCategory = ref('All')
const searchQuery = ref('')
const sortBy = ref('featured')
const maxPrice = ref(2000)
const sortChanged = ref(false)

function getCategoryCount(cat) {
  if (cat === 'All') return products.length
  return products.filter(p => p.category === cat).length
}

function selectCategory(cat) {
  activeCategory.value = cat
}

function onSortChange() {
  sortChanged.value = true
  // Filter doesn't actually do anything meaningful - just shuffles randomly
  setTimeout(() => { sortChanged.value = false }, 3000)
}

function clearFilters() {
  activeCategory.value = 'All'
  searchQuery.value = ''
  sortBy.value = 'featured'
}

const filteredProducts = computed(() => {
  let result = [...products]

  if (activeCategory.value !== 'All') {
    result = result.filter(p => p.category === activeCategory.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }

  // Sort is largely fake — just shuffles a bit
  if (sortBy.value === 'price-asc') {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result = [...result].sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'random') {
    result = [...result].sort(() => Math.random() - 0.5)
  }

  return result
})

onMounted(() => {
  gsap.from(headerEl.value, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  })
  gsap.from(gridEl.value?.children || [], {
    y: 30,
    duration: 0.4,
    stagger: 0.03,
    ease: 'power3.out',
    delay: 0.2,
  })
})
</script>
