import { Avatar, Box, Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { Card } from '@/components'
import { UserType } from '@/libs/types'
import { responsiveTextStyle } from '@/styles'

type AdminInforProps = {
  name: string
  email: string
  avatar_url: string
}

export const Contact = () => {
  const { data: adminInfor, isLoading: isLoading } = useQuery<UserType[]>('get-admin-contact')
  const { t } = useTranslation()
  return (
    <>
      {isLoading ? (
        <Box>Loading ...</Box>
      ) : (
        <Box>
          <Typography
            variant="h5"
            sx={{ mb: 4, textAlign: 'center', fontSize: { xs: 22, sm: 26 } }}
          >
            {t('contact.contact_admin')}
          </Typography>
          {/* {adminInfor?.map((item, index) => (
            <>
              <Typography>{item.name}</Typography>
            </>
          ))} */}
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {adminInfor?.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <AdminInforCard
                  name={item.name as any}
                  email={item.email}
                  avatar_url={item.avatar_url as any}
                />
              </Grid>
            ))}{' '}
          </Grid>
        </Box>
      )}
    </>
  )
}

const AdminInforCard = (props: AdminInforProps) => {
  const { name, email, avatar_url } = props
  return (
    <Card hasMore={false}>
      <Stack direction="row" spacing={2}>
        <Avatar
          src={avatar_url}
          sx={{
            width: {
              xs: 32,
              sm: 28,
            },
            height: {
              xs: 32,
              sm: 28,
            },
          }}
        />
        <Stack>
          <Typography>{name}</Typography>
          <Typography sx={{ opacity: 0.7, ...responsiveTextStyle }}>{email}</Typography>
        </Stack>
      </Stack>
    </Card>
  )
}
