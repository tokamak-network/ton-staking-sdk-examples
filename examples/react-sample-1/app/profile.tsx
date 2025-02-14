import { useAccount, useEnsName } from 'wagmi'

export function Profile() {
  const { address } = useAccount()
  // console.log('Profile', address)
  const { data, error, status } = useEnsName({ address })
  // console.log('useEnsName', data)

  // if (status === 'pending') return <div>Loading ENS name</div>
  // if (status === 'error')
  //   return <div>Error fetching ENS name: {error.message}</div>
  // return <div>ENS name: {data}</div>
}