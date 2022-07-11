import { getLoginSession } from '../../lib/auth'

export default async function user(req, res) {
  const session = await getLoginSession(req)

  res.status(200).json({ user: session || null });

}
