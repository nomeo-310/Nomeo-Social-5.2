import Link from 'next/link'
import React from 'react'
import { LinkIt, LinkItUrl } from 'react-linkify-it'

type linkfyProps = {
  children: React.ReactNode
}

const Linkify = ({children}: linkfyProps) => {
  const usernameRegex = /(@[a-zA-Z0-9_-]+)/
  const hashtagRegex = /(#[a-zA-Z0-9]+)/

  const LinkifyUrl = ({children}: linkfyProps) => {
    return <LinkItUrl className='text-primary hover:underline'>{children}</LinkItUrl>
  };

  const LinkifyUsername = ({children}: linkfyProps) => {
    return <LinkIt 
      regex={usernameRegex} 
      component={(match, key) => (<Link key={key} href={`/users/${match.slice(1)}`} 
      className='text-primary hover:underline'>
          {match}
        </Link>
        )}
      >{children}</LinkIt>
  };

  const LinkifyHashtags = ({children}: linkfyProps) => {
    return (
      <LinkIt 
      regex={hashtagRegex} 
      component={(match, key) => (<Link key={key} href={`/hashtag/${match.slice(1)}`} 
      className='text-primary hover:underline'>
        {match}
      </Link>
      )}     
      >{children}</LinkIt>
    )
  };

  return (
    <LinkifyUsername>
      <LinkifyHashtags>
        <LinkifyUrl>
          {children}
        </LinkifyUrl>
      </LinkifyHashtags>
    </LinkifyUsername>
  )
}

export default Linkify