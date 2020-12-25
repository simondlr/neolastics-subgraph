import { BigInt, ByteArray, json } from "@graphprotocol/graph-ts"
import { Minted, Burned } from '../generated/Curve/Curve'
import { Curve } from '../generated/schema'
import { getNeolastic, getCurve, getCollector } from './helpers';

export function handleNewCurveMinted(event: Minted): void {
  let curve = getCurve();
  curve.reserve = event.params.reserveAfterMint

  // add 0.001 ETH to get current mintPrice
  curve.mintPrice = curve.mintPrice.plus(json.toBigInt('1000000000000000'))
  // add 0.000995 to get current burnPrice
  curve.burnPrice = curve.burnPrice.plus(json.toBigInt('995000000000000'))
  curve.totalEverPaid = curve.totalEverPaid.plus(event.params.pricePaid)

  // add price paid to neolastic
  let neolastic = getNeolastic(event.params.tokenId.toString())
  neolastic.pricePaid = event.params.pricePaid

  curve.save()
  neolastic.save()
}

export function handleNewCurveBurned(event: Burned): void {
  let curve = getCurve();
  curve.reserve = event.params.reserveAfterBurn

  // minus 0.001 ETH to get current mintPrice
  curve.mintPrice = curve.mintPrice.minus(json.toBigInt('1000000000000000'))
  // minus 0.000995 to get current burnPrice
  curve.burnPrice = curve.burnPrice.minus(json.toBigInt('995000000000000'))

  curve.save()
}
