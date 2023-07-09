import styled from 'styled-components'

import { mq } from '@/styles/breakpoints'
import React from 'react'
import Head from 'next/head'
import { Nav } from './Nav'
import { Footer } from './Footer'

export const LayoutStyle = styled.div`
  // Vertically centered layout
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  gap: 3rem;

  width: 100%;
  padding: 2rem;
  min-height: 100svh;

  @media ${mq.sm.max} {
    padding: 1rem;
  }
`

export const Container = styled.div`
  width: 100%;
  max-width: 75%;
  height; 100%;
  margin-left: auto;
  margin-right: auto;
`

export const Layout = ({ children } : { children: React.ReactNode}) => {
  return(
    <LayoutStyle>
      <Head>
        <title>Web3 Sign a PDF</title>
        <meta name="description" content="This application allows you to attach a unique cryptographic signature to the top of a PDF file." />
        <meta property="og:image" content="" />
        <meta property="og:title" content="Web3 Sign a PDF" />
        <meta property="og:description" content="This application allows you to attach a unique cryptographic signature to the top of a PDF file." />
      </Head>
      <Nav />
      <Container
          as="main"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {children}
      </Container>
      <Footer />
    </LayoutStyle>
  )
}
