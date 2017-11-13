
export const REMOTE = {
    index: {
        queryQuestions: '/api/queryQuestions'
    },
    task: {
        taskFollows: '/post/[\w]+/subscribe',
        doFollow: '/post/[\w]/follows'
    },
    ask: {
        autoComplete: '/ask/autoCompleteUrl'
    }
}