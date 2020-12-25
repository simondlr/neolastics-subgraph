import { BigInt } from "@graphprotocol/graph-ts"
import { Neolastic, Curve, Collector } from "../generated/schema"

export function getCurve(): Curve {
    let curve = Curve.load("1")
  
    if (curve == null) {
      curve = new Curve("1")
      curve.totalSupply = new BigInt(0)
      curve.totalEverMinted = new BigInt(0)
      curve.totalEverPaid = new BigInt(0)
      curve.reserve = new BigInt(0)
      curve.mintPrice = new BigInt(0)
      curve.burnPrice = new BigInt(0)
    }
  
    return curve as Curve
}

export function getCollector(owner: string): Collector {
    let collector = Collector.load(owner)
  
    if (collector == null) {
      collector = new Collector(owner)
      collector.totalOwned = new BigInt(0)
    }
  
    return collector as Collector
}

export function getNeolastic(tokenId: string): Neolastic {
    let neolastic = Neolastic.load(tokenId)
  
    if (neolastic == null) {
      neolastic = new Neolastic(tokenId)
      neolastic.owner = ""
      neolastic.pricePaid = new BigInt(0)
      neolastic.created = new BigInt(0)
    }
  
    return neolastic as Neolastic
}