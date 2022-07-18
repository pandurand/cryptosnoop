import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { PrivyClient, CustomSession } from "@privy-io/privy-browser";

const userFetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null }
    })

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const { data, error } = useSWR(`${process.env.BASE_PATH}/api/user`, userFetcher)
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

const session = new CustomSession(async function authenticate() {
  //go fetch access token
  console.log(`${process.env.BASE_PATH}/api/privy/token`)
  const response = await fetch(`${process.env.BASE_PATH}/api/privy/token`)
  console.log(response);
  return (await response.json()).token
})

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
