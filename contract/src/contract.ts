import { NearBindgen, near, call, view, UnorderedMap, NearPromise, bytes, assert } from 'near-sdk-js';
import { Avatar, STORAGE_COST } from './model';

const NO_DEPOSIT = BigInt(0);
const FIVE_TGAS = BigInt("50000000000000");

@NearBindgen({})
class Nravatar {
  avatars: UnorderedMap = new UnorderedMap('avatars')

  @view({})
  get_avatar({account_id}:{account_id: string}): Avatar {
    return this.avatars.get(account_id) as Avatar;
  }

  @view({})
  number_of_avatar() {
    return this.avatars.length;
  }

  @view({})
  get_avatars({from_index = 0, limit = 50}: {from_index:number, limit:number}): Avatar[] {
    let ret:Avatar[] = [];
    let end = Math.min(limit, this.avatars.length);
    for(let i = from_index; i < end; i++){
      const account_id: string = this.avatars.keys.get(i) as string;
      const avatar: Avatar = this.get_avatar({account_id});
      ret.push(avatar);
    }
    return ret;
  }

  @call({ payableFunction: true })
  set_avatar({ contract_id, token_id }: { contract_id: string, token_id: string }) {
    let accountId = near.predecessorAccountId(); 
    let deposit: bigint = near.attachedDeposit() as bigint;
    
    let oldAvatar = this.avatars.get(accountId);
    if (oldAvatar === null) {
      assert(deposit > STORAGE_COST, `Attach at least ${STORAGE_COST} yoctoNEAR`);
    }
    const promise = NearPromise.new(contract_id)
    .functionCall("nft_token", bytes(JSON.stringify({ token_id })), NO_DEPOSIT, FIVE_TGAS)
    .then(
      NearPromise.new(near.currentAccountId())
      .functionCall("create_avatar", bytes(JSON.stringify({ account_id: accountId, contract_id, token_id })), NO_DEPOSIT, FIVE_TGAS)
    );

    return promise.asReturn();
  }

  @call({ privateFunction: true })
  create_avatar({ account_id, contract_id, token_id }: { account_id: string, contract_id: string, token_id: string }): Avatar {
    let { success, owner_id } = promiseResult();
    
    assert(success, "NFT contract or token id is not valid");
    assert(owner_id === account_id, `NFT is owned by the ${owner_id}, not ${account_id}`);

    let avatar = new Avatar({ contract_id, token_id });
    this.avatars.set(account_id, avatar);

    return avatar;
  }

  @view({})
  delete_avatar() {
    let accountId = near.predecessorAccountId(); 
    this.avatars.set(accountId, null);
  }
}

function promiseResult(): { success: boolean, owner_id: string } {
  let success, owner_id;
  
  try {
    let result = near.promiseResult(0);
    if (typeof result === 'string') {
      let nft_token = JSON.parse(result);
      owner_id = nft_token.owner_id;
    }
    success = true;
  } catch{
    success = false;
    owner_id = '';
  }
  
  return {
    success,
    owner_id,
  };
}