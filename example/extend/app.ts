import axios from '../../src/index'

interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}
interface User {
  name: string
  age: number
}

function getUser<T>() {
  return axios<ResponseData<User>>('/extend/user')
    .then(res => res.data)
    .catch(console.error)
}

async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user.result.age) // 类型推断出
  }
}

test()
