import Pusher from "pusher"

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER
})

export default (req, res) => {
  const auth = pusher.authenticate(
    req.body.socket_id,
    req.body.channel_name
  );

  res.send(auth)
}