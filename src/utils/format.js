import ceil from 'lodash/ceil'

export const formatPrice = (price = '') => {
  return ceil(price, 3)
}
