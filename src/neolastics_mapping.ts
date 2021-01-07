import { BigInt, store, log } from "@graphprotocol/graph-ts"
import { Minted, Burned, Transfer } from '../generated/Neolastics/Neolastics'
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

export function handleTransfer(event: Transfer): void {
  // NOTES:
  // Transfer is fired on mint + burn.
  // Mint from 0x0 to <mint_address>
  // Burn from <owner> to 0x0.
  // Thus: when changing ownership, only change it in the graph when not using the 0x0 address.
  // You can't transfer 0x0 normally, so this won't fire otherwise.
  if(event.params.from.toHexString() !== "0x0000000000000000000000000000000000000000" ||
    event.params.to.toHexString() !== "0x0000000000000000000000000000000000000000") {
    // first fetch collector in case they don't exist yet.
    let newCollector = getCollector(event.params.to.toHexString())
    newCollector.totalOwned = newCollector.totalOwned.plus(BigInt.fromI32(1)); 

    // subtract oldCollector's stats
    let oldCollector = getCollector(event.params.from.toHexString())
    oldCollector.totalOwned = oldCollector.totalOwned.minus(BigInt.fromI32(1))

    let neolastic = getNeolastic(event.params.tokenId.toString())
    neolastic.owner = event.params.to.toHexString();

    neolastic.save();
    newCollector.save();
    oldCollector.save();
  }
}
