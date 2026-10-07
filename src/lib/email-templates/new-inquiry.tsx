import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props { email?: string; inquiry?: string; comments?: string }

const NewInquiry = ({ email, inquiry, comments }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New invitation request from {email ?? 'someone'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>NEW INVITATION REQUEST</Text>
        <Heading style={h1}>Someone wants in.</Heading>
        <Section style={box}>
          <Text style={label}>EMAIL</Text>
          <Text style={value}>{email ?? 'Not given'}</Text>
          <Text style={label}>HERE AS</Text>
          <Text style={value}>{inquiry ?? 'Not chosen'}</Text>
          <Text style={label}>COMMENTS</Text>
          <Text style={value}>{comments || 'No comments.'}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewInquiry,
  subject: (d: Record<string, any>) => `New request: ${d.inquiry ?? 'General inquiry'}`,
  displayName: 'New invitation request (to Liv)',
  to: 'liv@goodchapter.com',
  previewData: { email: 'friend@example.com', inquiry: 'Investor', comments: 'Loved the toaster line.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#0E2A21' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const eyebrow = { fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.14em', color: '#C2402F' }
const h1 = { fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: '28px', margin: '8px 0 20px' }
const box = { border: '2px solid #0E2A21', borderRadius: '4px', padding: '16px 20px', backgroundColor: '#F4E8DC' }
const label = { fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.14em', margin: '12px 0 2px', color: '#284CD6' }
const value = { fontSize: '16px', margin: '0', whiteSpace: 'pre-wrap' as const }
