const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bp = require('body-parser')
const { v4: uuidV4 } = require('uuid') //dont really need to use this imo.
app.use(bp.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  // res.redirect(`/${uuidV4()}`) --webDev Said so.
  // res.redirect('/default')
  res.render('main')

  //This also works for custom room IDs. That can be used for creating multiple separate rooms n selective entry.
  //Maybe later... use body parser to get the room IDs from the user login page to send them to the required room directly instead of 
  //redirecting them to the default routes.
})
  
app.post('/', (req, res) => {
  // var h = req.body.userid\

  //check for form submission******************************

  console.log(req.body);
  var rid = req.body.roomid
  res.redirect('/' + rid)
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