export const smallImage = (url, height = 80) => {
  if (
    url.substring(0, 49) !== "https://res.cloudinary.com/dpd08wa9g/image/upload"
  ) {
    return url;
  }
  const arr = url.split("/");
  arr.splice(6, 0, `c_thumb,g_auto,h_${height}`);
  return arr.join("/");
};