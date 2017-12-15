import { REMOTE, ajax } from '../../common/js/ajax.js'

export default {
  getQuestions() {
    return ajax(
      REMOTE.index.queryQuestions,
      params
    )
  }
}
