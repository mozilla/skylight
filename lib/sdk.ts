import { LookerNodeSDK } from "@looker/sdk-node"
import { Looker40SDK } from "@looker/sdk"

export let SDK: Looker40SDK;

export function getLookerSDK(): Looker40SDK {
  if (!SDK) {
    SDK = LookerNodeSDK.init40();
  }
  return SDK;
}

SDK = getLookerSDK();

console.log('LOOKER ENABLED: ', process.env.IS_LOOKER_ENABLED);