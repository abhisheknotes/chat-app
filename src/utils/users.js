const users = []

const addUser = ({ id, username, room }) => {

    // Clean data

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data 

    if (!username || !room) {
        return {
            error: 'Username and Room are required.'
        }
    }

    // Check for existing user

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate Username

    if (existingUser) {
        return {
            error: 'Username is taken, please choose another username.'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }

}


const getUser = (id) => {
    return users.find((user) => user.id === id)
    // return users.find((user) => {user.id === id}) - How come this is not working, but the above code runs.
}


const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}
