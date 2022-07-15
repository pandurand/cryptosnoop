import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { PrivyClient, CustomSession } from "@privy-io/privy-browser";

const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null }
    })

const session = new CustomSession(async function authenticate() {
  //go fetch access token
  const response = await fetch(`${process.env.BASE_PATH}/api/privy/token`)
  return (await response.json()).token
})

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const { data, error } = useSWR(`${process.env.BASE_PATH}/api/user`, fetcher)
  const user = data?.user
  const finished = Boolean(data)
  const hasUser = Boolean(user)

  useEffect(() => {
    if (!redirectTo || !finished) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, finished, hasUser])
  return error || !user ? null : user
}

export function useSession({ redirectTo, redirectIfFound } = {}) {
  const user = useUser({ redirectTo, redirectIfFound });
  if (user) {
    return {
      email: user.email, client: new PrivyClient({
        session: session
      })
    }
  }
  return null;
}
