export const STORAGE_COST: bigint = BigInt("1000000000000000000000")

export class Avatar {
  contract_id: string;
  token_id: string;

  constructor({contract_id, token_id}: Avatar) {
    this.contract_id = contract_id;
    this.token_id = token_id;
  }
}