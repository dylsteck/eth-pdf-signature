import { ConnectButton } from '@rainbow-me/rainbowkit'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
`

const Title = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
`

export function Nav() {
  return (
    <Wrapper>
      <Title><a href="/">Web3 Sign a PDF</a></Title>
      <ConnectButton chainStatus="none" showBalance={false} />
    </Wrapper>
  )
}
