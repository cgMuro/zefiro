export default (state, { type, payload }) => {
    switch (type) {
        case 'GET_ERRORS':
            return {
                msg: payload.msg,
                status: payload.status,
                id: payload.id
            }
        case 'CLEAR_ERRORS':
            return {
                msg: null,
                status: null,
                id: null
            }
        default:
            return state
    }
}