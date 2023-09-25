import { css, styled } from '@kuma-ui/core'
import Link from 'next/link'

import type { NextPage } from 'next'

const Test: NextPage = () => {
  return (
    <div>
      <H1>Test</H1>
      <Link href='/' className={linkStyle}>
        Home
      </Link>
    </div>
  )
}
export default Test

const H1 = styled('h1')`
  color: red;
`

const linkStyle = css`
  color: blue;
`
