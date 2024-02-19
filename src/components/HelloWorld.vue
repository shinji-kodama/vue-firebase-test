<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { addData, onSnapshotTest, type ChatData } from '../modules/firebase'

type ResFromHelloWorld = { text: string }

/**
 * Hello Vite というテキストを表示するためのもの
 */
const text = ref<string>('Chat App With Firebase !')

const setText = (s: string): void => {
  text.value = s
}

// エラー処理は本気で適当です
const fetchTextFromFunctions = async (): Promise<string> => {
  const res = await fetch('http://127.0.0.1:5001/techpit-vue-test/us-central1/helloWorld') // cloiud functions を localで動かす場合はこちら
  // const res = await fetch('https://helloworld-55fmoldctq-uc.a.run.app/helloWorld') // cloud functions をデプロイした方で動かす場合はこちら
    .catch(e => {
      console.error(e)
      throw new Error('Network Error')
    })

  if(!res.ok) throw new Error('API Error') 

  const data: ResFromHelloWorld  = await res.json()
    .catch(e => {
      console.error(e)
      throw new Error('JSON Parse Error')
    })

  return data.text;
}

const onClickButton = async (): Promise<void> => {
  const data = await fetchTextFromFunctions()
  setText(data)
}

/**
 * チャットに関連するもの
 */
const chats = ref<string[]>([])
const chatText = ref<string>('')
const user = ref<string>('')
const unsub = ref<any>(null)

const sendChat = (): void => {
  addData(chatText.value, user.value)
}

// チャットのデータを受け取った時の処理（onSnapShotTestメソッドにコールバックで渡す）
const showChat = (id: string, data: ChatData): void => {
  console.log(id)
  chats.value.push(data.msg + ' - ' + data.user + ' @ ' + data.date.toDate().toLocaleString())
}

// ページ読み込み完了時にfirestoreの監視を開始する
onMounted(() => {
  unsub.value = onSnapshotTest(showChat)
})

// ページを閉じる時にfirestoreの監視を終了する
onBeforeUnmount(() => {
  unsub.value()
})


</script>

<template>
  <h1>{{ text }}</h1>
  <h2>Cloud Functions</h2>
  <button @click="onClickButton">Exec function in cloud functions !</button>
  <h2>Chat</h2>
  <ul>
    <li v-for="chat in chats">
      {{ chat }}
    </li>
  </ul>
  <div>
    <p>Your Name</p>
    <input type="text" v-model="user">
  </div>
  <div style="padding-bottom: 1rem;">
    <p>Message</p>
    <input type="text" v-model="chatText">
  </div>
  <button @click="sendChat"> SEND </button>
</template>