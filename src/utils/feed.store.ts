import { feedList, type Pixel } from "@/store";

const othersPlaceMessages = [
  "Left a spectral trace at",
  "Seeded a signal in the grid at",
  "A presence known as has touched at",
  "Etched a pulse at",
  "A soul has left a mark at",
];

export function addFeedStore(pixel: Pixel) {
  let message = parseMessage(pixel);
  pixel.message = message;
  pixel.uuid = crypto.randomUUID();
  pixel.created_at = new Date(pixel.created_at).toLocaleString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const newFeedList = [...feedList.get()];
  newFeedList.unshift(pixel);
  feedList.set(newFeedList);
}

function parseMessage(newPixel: Pixel) {
  return getRandom(othersPlaceMessages);
}

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
