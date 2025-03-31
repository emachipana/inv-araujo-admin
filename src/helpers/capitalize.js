export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const capitalizeAll = (string) => {
  return string
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
