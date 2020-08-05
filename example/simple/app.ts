import axios from '../../src/index'

axios({
  method: 'get',
  url: '/simple/get',
  paramas: {
    a: 1,
    b: 2
  }
})
