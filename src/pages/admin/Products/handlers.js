export const handleClick = (event, id, navigate) => {
  event.stopPropagation();
  navigate(`${id}/edit`);
}
