import { Grid, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { Card } from '@/components'
import { userAtomWithStorage } from '@/libs/atoms'
import { useAuth } from '@/libs/hooks'
import { UserType } from '@/libs/types'
import { convertDatetimeTZWithoutSecond } from '@/libs/utils'
import { backgroundColor, CurveBoxWithCustomBackground } from '@/styles'

type HistoryItemProps = {
  user?: UserType
  currentScore: number
  donateTime: string | Date
  points: number
  isTakePoints: boolean
  isAdminInitial?: boolean
}

const HistoryItem = (props: HistoryItemProps) => {
  const { user, isTakePoints, isAdminInitial = false, donateTime, points, currentScore } = props
  const { t } = useTranslation()
  return (
    <CurveBoxWithCustomBackground
      sx={{ mb: 2 }}
      bgColor={isTakePoints ? backgroundColor.tag.green : backgroundColor.tag.red}
    >
      <Grid container rowSpacing={{ xs: 0.5, sm: 'unset' }} alignItems="center">
        <Grid item xs={12} sm={2.5}>
          <Typography sx={{ ...dateAndScoreStyle }}>
            {convertDatetimeTZWithoutSecond(donateTime)}
          </Typography>
        </Grid>

        {isAdminInitial ? (
          <Grid item xs={12} sm={7}>
            <Typography sx={{ ...contentStyle }}>
              {t('donate.first_time_sign_in')}{' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {t('donate.admin')}
              </Typography>{' '}
              {t('donate.give_you')}{' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {points} {t('donate.points')}
              </Typography>{' '}
            </Typography>
          </Grid>
        ) : isTakePoints ? (
          <Grid item xs={12} sm={7}>
            <Typography sx={{ ...contentStyle }}>
              <Typography component="span" sx={{ ...userNameStyle }}>
                {user?.name}
              </Typography>{' '}
              ({user?.email}) {t('donate.gived_you')}{' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {points} {t('donate.points')}
              </Typography>{' '}
            </Typography>
          </Grid>
        ) : (
          <Grid item xs={12} sm={7}>
            <Typography sx={{ ...contentStyle }}>
              {t('donate.you_have_give')}{' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {user?.name}
              </Typography>{' '}
              ({user?.email}){' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {points} {t('donate.points')}
              </Typography>{' '}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={2.5}>
          <Typography sx={{ ...dateAndScoreStyle }}>
            {t('donate.curr_score')}
            {currentScore}
          </Typography>
        </Grid>
      </Grid>
    </CurveBoxWithCustomBackground>
  )
}

type DonateHistoryData = {
  id: number
  user_donate: UserType
  user_take: UserType
  points: number
  user_donate_curr_score: number
  user_take_curr_score: number
  created_at: string | Date
}
export const DonateHistory = () => {
  const [userStorage] = useAtom(userAtomWithStorage)
  const { setting } = useAuth()
  const { t } = useTranslation()
  const { data: donateHistories } = useQuery<DonateHistoryData>([`/donate/get-by-my-id`])
  return (
    <Card title={t('donate.history')} hasMore={false}>
      {/* @ts-ignore */}
      {donateHistories?.data?.map((item, index) =>
        !item.user_donate?.id ? (
          // admin initial
          <HistoryItem
            currentScore={item?.user_take_curr_score as any}
            donateTime={userStorage?.created_at as any}
            points={setting?.initial_point as any}
            isTakePoints={true}
            isAdminInitial={true}
          />
        ) : item.user_donate.id === userStorage?.id ? (
          // myself donate (give points)
          <HistoryItem
            user={item.user_take}
            currentScore={item.user_donate_curr_score}
            donateTime={item.created_at}
            points={item.points}
            isTakePoints={false}
          />
        ) : (
          // myself is donated by other user (take points)
          <HistoryItem
            user={item.user_donate}
            currentScore={item.user_take_curr_score}
            donateTime={item.created_at}
            points={item.points}
            isTakePoints={true}
          />
        ),
      )}
    </Card>
  )
}

export const dateAndScoreStyle = {
  fontSize: { xs: 12, sm: 14 },
  opacity: 0.7,
}

export const contentStyle = {
  fontSize: { xs: 14, sm: 16 },
  opacity: 0.7,
  lineHeight: { xs: 1.2, sm: 'unset' },
}

export const userNameStyle = {
  fontSize: { xs: 15, sm: 17 },
  fontWeight: 700,
  lineHeight: { xs: 1.2, sm: 'unset' },
}
