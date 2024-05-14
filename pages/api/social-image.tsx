import * as React from 'react'
import { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og'

import { api, apiHost, rootNotionPageId } from '@/lib/config'
import { NotionPageInfo } from '@/lib/types'

const pressuraRegular = fetch(
  new URL('../../public/fonts/GT-Pressura-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

export const config = {
  runtime: 'experimental-edge',
}

export default async function OGImage(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pageId = searchParams.get('id') || rootNotionPageId
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 })
  }

  const pageInfoRes = await fetch(`${apiHost}${api.getNotionPageInfo}`, {
    method: 'POST',
    body: JSON.stringify({ pageId }),
    headers: {
      'content-type': 'application/json'
    }
  })
  if (!pageInfoRes.ok) {
    return new Response(pageInfoRes.statusText, { status: pageInfoRes.status })
  }
  const pageInfo: NotionPageInfo = await pageInfoRes.json()
  console.log(pageInfo)

  const [pressuraRegularFont] = await Promise.all([
    pressuraRegular
  ])

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          fontFamily: '"Pressura", sans-serif',
        }}
      >
        <svg width="82" height="131" viewBox="0 0 164 262" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M146.747 239.667L18.6111 22.3335H104.639L136.333 76.6668L18.6111 239.667V22.3335" stroke="#fff" strokeWidth="19.0167" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontFamily: '"Pressura", sans-serif',
          fontSize: 60,
          margin: '0 5rem',
        }}>
          RDFN
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Pressura',
          data: pressuraRegularFont,
          style: 'normal',
          weight: 500
        }
      ]
    }
  )
}
