<script setup>
definePageMeta({
  middleware: 'auth'
})
const loading = ref(false)
const newWord = ref('')
const newWordInput = ref(null)
const wordsCount = ref((await useFetch('/api/words/stats')).data.value.words)

const toast = useToast()
const { user, clear } = useUserSession()
const { data: words } = await useFetch('/api/words')

const filteredWords = computed(() => {
  if (!newWord.value) {
    return words.value // If no input, return all words.
  }
  return words.value.filter((word) => word.content.toLowerCase().includes(newWord.value.toLowerCase()))
})

async function addWord() {
  if (!newWord.value.trim()) { return }

  loading.value = true

  try {
    const response = await fetch('/api/words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: newWord.value
      })
    })

    if (response.status === 401) {
      toast.add({ title: 'Please refresh the page and try again.', color: 'red' })
      return
    }

    if (response.status === 403) {
      toast.add({ title: 'You are not eligible to add words.', color: 'red' })
      return
    }

    const word = await response.json()

    if (word) {
      words.value.push(word)
      wordsCount.value = wordsCount.value + 1
      toast.add({ title: `Word "${word.content}" created.` })
      newWord.value = ''
      nextTick(() => {
        newWordInput.value?.input?.focus()
      })
    }
  } catch (error) {
    toast.add({ title: 'An error occurred.', color: 'red' })
  } finally {
    loading.value = false
  }
}

async function deleteWord(word) {
  try {
    const response = await fetch(`/api/words/${word.id}`, { method: 'DELETE' })

    if (response.status === 401) {
      toast.add({ title: 'Please refresh the page and try again.', color: 'red' })
      return
    }

    if (response.status === 403) {
      toast.add({ title: 'You are not eligible to remove words.', color: 'red' })
      return
    }

    if (response.ok) {
      words.value = words.value.filter(t => t.id !== word.id)
      wordsCount.value = wordsCount.value - 1
      toast.add({ title: `Word "${word.content}" deleted.` })
    }
  } catch (error) {
    toast.add({ title: 'An error occurred.', color: 'red' })
  }
}

const items = [[{
  label: 'Logout',
  icon: 'i-heroicons-arrow-left-on-rectangle',
  click: clear
}]]
</script>

<template>
  <UCard @submit.prevent="addWord">
    <template #header>
      <h3 class="text-lg font-semibold leading-6">
        <NuxtLink to="/">
          Word List ({{ wordsCount }})
        </NuxtLink>
      </h3>

      <UDropdown v-if="user" :items="items">
        <UButton color="white" trailing-icon="i-heroicons-chevron-down-20-solid">
          <UAvatar :src="`${user.picture}`" :alt="user.login" size="3xs" />
          {{ user.name }}
        </UButton>
      </UDropdown>
    </template>

    <div class="flex items-center gap-2">
      <UInput
        ref="newWordInput"
        v-model="newWord"
        name="word"
        :disabled="loading"
        class="flex-1"
        placeholder="Type any word..."
        autocomplete="off"
        autofocus
        :ui="{ wrapper: 'flex-1' }"
      />

      <UButton type="submit" icon="i-heroicons-plus-20-solid" :loading="loading" :disabled="newWord.trim().length === 0" />
    </div>

    <ul class="divide-y divide-gray-200 dark:divide-gray-800">
      <li
        v-for="word in filteredWords"
        :key="word.id"
        class="flex items-center gap-4 py-2"
      >
        <span class="flex-1 font-medium" :class="[word.completed ? 'line-through text-gray-500' : '']">{{ word.content }}</span>

        <UButton
          color="red"
          variant="soft"
          size="2xs"
          icon="i-heroicons-x-mark-20-solid"
          @click="deleteWord(word)"
        />
      </li>
    </ul>
  </UCard>
</template>
