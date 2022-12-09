import { Box } from '@mui/material'
import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useQuery } from 'react-query'

import { userAtomWithStorage } from '@/libs/atoms'
import { settingAtom } from '@/libs/atoms/settingAtom'
import { SettingType } from '@/libs/types/setting'

import { DonateHistory } from './DonateHistory'
import { ListScoreToMoneyForm } from './ListScoreToMoneyForm'
import { UserInfo } from './UserInfo'

type Setting = {
  price_per_point: number
  initial_point: number
}
export const UserProfile = () => {
  const [userStorage] = useAtom(userAtomWithStorage)

  const setChangeSettingAtom = useUpdateAtom(settingAtom)
  useQuery<SettingType>('get-setting', {
    onSuccess: (data) => {
      setChangeSettingAtom(data)
    },
  })

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <UserInfo />
      </Box>
      <Box sx={{ mb: 3 }}>
        <DonateHistory />
      </Box>
      <Box sx={{ mb: 3 }}>
        <ListScoreToMoneyForm />
      </Box>{' '}
    </Box>
  )
}
