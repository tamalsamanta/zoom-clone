const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid') //dont really need to use this imo.

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  // res.redirect(`/${uuidV4()}`) --webDev Said so.
  res.redirect('/default')
  
  
  //This also works for custom room IDs. That can be used for creating multiple separate rooms n selective entry.
  //Maybe later... use body parser to get the room IDs from the user login page to send them to the required room directly instead of 
  //redirecting them to the default routes.
})

app.get('/:room', (req, res) => {
  res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)