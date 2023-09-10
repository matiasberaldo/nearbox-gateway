import styled from 'styled-components';
import { Mailchain } from '@mailchain/sdk';
import { resolveAddress } from '@mailchain/sdk/internal';

import { VmComponent } from '@/components/vm/VmComponent';

const Container = styled.div`
    height: 100vh;
`;

type Mail = {
    context: Mailchain|null,
    user: any,
    connect: any,
    disconnect: any,
    send: any,
    addressIsReachable: any,
    getNearAddressFromAccount: any
}

const lib: Mail = {
    context: null,
    user: null,
    connect: async (user: any) => {
        const mailchain = Mailchain.fromSecretRecoveryPhrase(user.phrase);
        const data = await mailchain.user();

        if (data.address) {
            lib.context = mailchain;
            lib.user = data;
        }

        return data;
    },
    disconnect: () => {
        lib.context = null;
        lib.user = null;
    },
    send: async (to: string, subject: string, text: string) => {
        const toMail = lib.getNearAddressFromAccount(to);

        return lib.addressIsReachable(to).then(async (isReachable: boolean) => {
            if (isReachable) {
                const result = await lib.context?.sendMail({
                    from: lib.user.address,
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
        })
    },
    addressIsReachable: async (account: string) => {
        const address = lib.getNearAddressFromAccount(account);
        const { data: resolvedAddress, error: resolveAddressError } = await resolveAddress(address);
        return !resolveAddressError && "registered" === resolvedAddress?.type;
    },
    getNearAddressFromAccount: (account: string) => {
        return `${account}@near.mailchain.com`;
    }
};


export function PolygonZkEVM() {
    return (
        <Container>
            <VmComponent
                src="mattb.near/widget/NearBox.Views.Home"
                props={{
                    MailChain: lib
                }}
            />
        </Container>
    )
}