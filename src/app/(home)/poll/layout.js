import React from 'react'
import { Container } from '@mui/material'

export const metadata = {
  title: '설문조사',
  description: 'Generated by 설문조사',
}

export default function RootLayout({ children }) {
  return (
    <Container maxWidth="sm">
      <div>{children}</div>
    </Container>
  )
}
