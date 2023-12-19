import { newCarProduct, updatedCarProduct } from '../../../type/carProducts'
import db from '../connection'

export async function getAllCarProducts() {
  const res = await db('carProducts')
    .join('models', 'carProducts.model_id', 'models.id')
    .join('locations', 'carProducts.location_id', 'locations.id')
    .select(
      'carProducts.id as id',
      'carProducts.rego_number as rego_number',
      'models.name as model',
      'locations.name as location',
      'carProducts.daily_rate as daily_rate',
      'carProducts.is_available as is_available'
    )
  return res.reverse()
}

export async function deleteCarProduct(carProductId: number) {
  await db('carProducts').where('id', carProductId).del()
}

export async function addCarProduct(newCarProduct: newCarProduct) {
  await db('carProducts').insert(newCarProduct)
}

export async function editCarProduct(
  carProductId: number,
  updatedCarProduct: updatedCarProduct
) {
  await db('carProducts').where('id', carProductId).update(updatedCarProduct)
}
