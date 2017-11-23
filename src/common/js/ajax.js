
export const REMOTE = {
    index: {
        queryQuestions: '/post/query'
    },
    task: {
        taskFollows: '/post/[\w]+/subscribe',
        doFollow: '/post/[\w]/follows'
    },
    ask: {
        autoComplete: '/tag/auto_complete',
        fileupload: '/ask/fileupload'
    }
}