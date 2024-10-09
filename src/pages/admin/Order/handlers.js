export const filterProducts = (order, backup) => { 
  return backup.filter(product => !order.items.find(item => item.product.id === product.id));
}
