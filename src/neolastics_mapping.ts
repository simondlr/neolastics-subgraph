import { BigInt, store, log } from "@graphprotocol/graph-ts"
import { Minted, Burned } from '../generated/Neolastics/Neolastics'
import { Neolastic, Collector, Curve } from '../generated/schema'
import { getNeolastic, getCurve, getCollector } from './helpers';


export function handleNewERC721Minted(event: Minted): void {
  let collector = getCollector(event.params.to.toHexString());
  collector.totalOwned = collector.totalOwned.plus(BigInt.fromI32(1));

  let curve = getCurve();
  curve.totalSupply = event.params.supplyAfterMint
  curve.totalEverMinted = event.params.totalEverMinted

  let neolastic = getNeolastic(event.params.tokenId.toString())
  neolastic.owner = event.params.to.toHexString();
  neolastic.created = event.params.timestamp;

  neolastic.save()
  collector.save()
  curve.save()
}

export function handleNewERC721Burned(event: Burned): void {
  let neolastic = getNeolastic(event.params.tokenId.toString())
  let collector = getCollector(event.params.owner.toString())
  let curve = getCurve();

  collector.totalOwned = collector.totalOwned.minus(BigInt.fromI32(1));

  curve.totalSupply = event.params.supplyAfterBurn

  collector.save()
  curve.save()
  store.remove('Neolastic', event.params.tokenId.toString())
}
