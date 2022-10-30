/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class Nravatar {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;    
  }

  async getAvatar() {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'get_avatar', args: { account_id: 'chezhe.testnet' } });
  }

  async getAvatars() {
    return await this.wallet.viewMethod({ contractId: this.contractId, method: 'get_avatars' });
  }

  async setAvatar({ contractId, tokenId }) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'set_avatar',
      args: {
        contract_id: contractId,
        token_id: tokenId
      },
      // gas: '100000000000000',
      deposit: '2000000000000000000000'
    });
  }

  async deleteAvatar() {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'delete_avatar',
      args: {},
    });
  }
}