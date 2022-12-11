import { Box } from '@mui/material'
import { useUpdateAtom } from 'jotai/utils'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { Card, Chip, PublicIcon } from '@/components'
import { settingAtom } from '@/libs/atoms/settingAtom'
import { SettingType } from '@/libs/types/setting'
import { BoxFlexStart, BoxHeader } from '@/styles'

import { SystemSetting } from './SystemSetting'

export const AdminDashboard = () => {
  const { t } = useTranslation()

  const setChangeSettingAtom = useUpdateAtom(settingAtom)
  useQuery<SettingType>('get-setting', {
    onSuccess: (data) => {
      setChangeSettingAtom(data)
    },
  })

  return (
    <Box>
      <Box>
        <Card
          title={
            <BoxFlexStart sx={{ alignItems: 'center' }}>
              <BoxHeader sx={{ mr: 2 }}>{t('Setting')}</BoxHeader>
              <Chip startIcon={<PublicIcon />} content={`${t('Edit')}`} />
            </BoxFlexStart>
          }
          hasMore={false}
        >
          <SystemSetting />
        </Card>
      </Box>
    </Box>
  )
}
