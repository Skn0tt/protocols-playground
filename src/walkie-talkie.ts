import Pusher, { Channel } from "pusher-js";

let channel = undefined;

const pusher = new Pusher(process.env.PUSHER_APP_ID, {
  cluster: process.env.PUSHER_CLUSTER,
  authEndpoint: "/api/pusher-auth"
});

let subscription: Channel | undefined = undefined;

export function getChannel() {
  return channel;
}

export function setChannel(nr: number) {
  localStorage.setItem("channel", "" + nr);
  channel = nr;

  subscription?.unsubscribe();
  subscription = pusher.subscribe("private-" + nr)
}

export function listen(listener: (msg: string) => void) {
  pusher.bind("client-message", listener);
}

export function send(msg: string) {
  subscription.trigger("client-message", msg);
}

setChannel(+(localStorage.getItem("channel") ?? "0"));
