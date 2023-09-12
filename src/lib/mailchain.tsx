import { Mailchain } from '@mailchain/sdk';
import { resolveAddress } from '@mailchain/sdk/internal';

interface UserInterface {
  address: string;
  username: string;
}

interface MailchainInterface {
  context: Mailchain|null;
  user: UserInterface|null;
  connect: object;
  disconnect: any;
  send: any;
  addressIsReachable: any;
  getNearAddressFromAccount: any;
}

export class MailchainSDK implements MailchainInterface {
  context: Mailchain|null = null;
  user: UserInterface|null = null;

  async connect(user: {mail: string, phrase: string}): Promise<UserInterface> {
    const mailchain = Mailchain.fromSecretRecoveryPhrase(user.phrase);
    const data: UserInterface = await mailchain.user();

    if (data.address) {
        this.context = mailchain;
        this.user = data;
    }

    return data;
  }

  disconnect(): void {
    this.context = null;
    this.user = null;
  }

  async send(to: string, subject: string, text: string): Promise<boolean> {
    const toMail = this.getNearAddressFromAccount(to);

    return this.addressIsReachable(to).then(async (isReachable: boolean) => {
        if (isReachable) {
            const result = await this.context?.sendMail({
                from: this.user!.address,
                to: [toMail],
                subject,
                content: {
                    text,
                    html: `<p>${text}</p>`,
                },
            });

            return !result?.error;
        } else {
            return false;
        }
    });
  }

  async notifyNFT(to: string, nftUrl: string, text: string): Promise<boolean> {
    const toMail = this.getNearAddressFromAccount(to);

    return this.addressIsReachable(to).then(async (isReachable: boolean) => {
        if (isReachable) {
            const result = await this.context?.sendMail({
                from: this.user!.address,
                to: [toMail],
                subject: `You've just received a brand new NFT from ${this.user!.username}!`,
                content: {
                    text,
                    html: `
                    <h1>Take a look at your brand new NFT!</h1>
                    <br/>
                    <img src="${nftUrl}" style="max-width:300px;" />
                    <br/>
                    <p>${text}</p>
                    `,
                },
            });

            return !result?.error;
        } else {
            return false;
        }
    });
  }

  async addressIsReachable(account: string): Promise<boolean> {
    const address = this.getNearAddressFromAccount(account);
    const { data: resolvedAddress, error: resolveAddressError } = await resolveAddress(address);
    return (!resolveAddressError && "registered" === resolvedAddress?.type);
  }

  getNearAddressFromAccount(account: string): string {
    return `${account}@near.mailchain.com`;
  }
}