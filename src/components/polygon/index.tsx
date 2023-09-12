import styled from 'styled-components';
import { MailchainSDK } from '@/lib/mailchain';

import { VmComponent } from '@/components/vm/VmComponent';

const Container = styled.div`
    height: 100vh;
`;

export function PolygonZkEVM() {
    return (
        <Container>
            <VmComponent
                src="mattb.near/widget/NearBox.Views.Home"
                props={{
                    MailChain: new MailchainSDK()
                }}
            />
        </Container>
    )
}