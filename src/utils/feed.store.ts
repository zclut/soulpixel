import { feedList, type Pixel } from "@/store";

const selfPlaceMessages = [
  "You’ve imprinted a fragment of your soul at ",
  "Your light now pulses at ",
  "A soul signal has been placed by you at ",
  "You whispered into the void at ",
  "Your essence now echoes at ",
];

const othersPlaceMessages = [
  "{user} left a spectral trace at ",
  "{user} seeded a signal in the grid at ",
  "A presence known as {user} has touched at ",
  "{user} etched a pulse at ",
  "The grid now bears the will of {user} at ",
];

const pixelStolenMessages = [
  "{user} has overwritten your soul mark at ",
  "{user} replaced your echo at ",
  "Your pixel was consumed by {user} at ",
  "The spirit of {user} displaced yours at ",
  "{user} invaded your essence at ",
];

const userReplacedAnotherUserMessages = [
  "{newUser} has silenced the echo of {oldUser} at ",
  "{newUser} has rewritten the soulprint of {oldUser} at ",
  "{oldUser}’s presence was absorbed by {newUser} at ",
  "The mark of {oldUser} has faded into {newUser}’s will at ",
  "A silent duel ended: {newUser} overpowered {oldUser} at ",
  "{newUser} disrupted the harmony once held by {oldUser} at ",
  "The grid now speaks in {newUser}’s voice, where once was {oldUser} at ",
  "{newUser} displaced {oldUser} in the endless canvas of souls at ",
  "The essence of {oldUser} was overwritten by {newUser} at ",
  "A spectral conflict ends as {newUser} takes over from {oldUser} at ",
];

export function addFeedStore(pixel: Pixel, yourUsername: string) {

  let oldPixel =
    feedList.get().find((pixel) => pixel.x === pixel.x && pixel.y === pixel.y) ??
    null;
  let message = parseMessage(pixel, oldPixel, yourUsername ?? "Anonymous");
  pixel.message = message;
  const newFeedList = [...feedList.get(), pixel];
  feedList.set(newFeedList);
}

function parseMessage(
  newPixel: Pixel,
  oldPixel: Pixel | null,
  username: string
) {
  const { x, y } = newPixel;
  const isUser = newPixel.user === username;
  const isNew = !oldPixel;
  const isOldPixelYours = oldPixel && oldPixel?.user === username;
  console.log("isUser", isUser);
  console.log("isNew", isNew);
  console.log("isOldPixelYours", isOldPixelYours);
  console.log("oldPixel", oldPixel);
  
  if (isUser && isNew) {
    return getRandom(selfPlaceMessages);
  }

  if (!isUser && isNew) {
    return formatMessage(getRandom(othersPlaceMessages), newPixel.user);
  }

  if (!isUser && isOldPixelYours) {
    return formatMessage(getRandom(pixelStolenMessages), newPixel.user);
  }
  if (!isUser && !isOldPixelYours && oldPixel) {
    return formatOtherUserMessage(
      getRandom(userReplacedAnotherUserMessages),
      newPixel.user,
      oldPixel.user
    );
  }

  return getRandom(selfPlaceMessages);
}

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatOtherUserMessage(
  template: string,
  newUser: string,
  oldUser: string
) {
  return template.replace("{newUser}", newUser).replace("{oldUser}", oldUser);
}
function formatMessage(template: string, user: string): string {
  return template.replace("{user}", user);
}
