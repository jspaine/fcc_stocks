let socket
export default (sock) => socket = sock

export const addStock = (stock) => socket.emit('add-stock', stock)
export const removeStock = (stockId) => socket.emit('remove-stock', stockId)
