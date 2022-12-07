import { Grid, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'

import { Card } from '@/components'
import { userAtomWithStorage } from '@/libs/atoms'
import { UserType } from '@/libs/types'
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
  return (
    <CurveBoxWithCustomBackground
      sx={{ mb: 2 }}
      bgColor={isTakePoints ? backgroundColor.tag.green : backgroundColor.tag.red}
    >
      <Grid container rowSpacing={{ xs: 0.5, sm: 'unset' }} alignItems="center">
        <Grid item xs={12} sm={2.5}>
          <Typography sx={{ ...dateAndScoreStyle }}>{donateTime}</Typography>
        </Grid>

        {isAdminInitial ? (
          <Grid item xs={12} sm={7}>
            <Typography sx={{ ...contentStyle }}>
              Lần đầu đăng nhập,{' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                Admin
              </Typography>{' '}
              tặng bạn{' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {points} điểm
              </Typography>{' '}
            </Typography>
          </Grid>
        ) : isTakePoints ? (
          <Grid item xs={12} sm={7}>
            <Typography sx={{ ...contentStyle }}>
              <Typography component="span" sx={{ ...userNameStyle }}>
                {user?.name}
              </Typography>{' '}
              ({user?.email}) đã tặng bạn{' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {points} điểm
              </Typography>{' '}
            </Typography>
          </Grid>
        ) : (
          <Grid item xs={12} sm={7}>
            <Typography sx={{ ...contentStyle }}>
              Bạn đã tặng{' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {user?.name}
              </Typography>{' '}
              ({user?.email}){' '}
              <Typography component="span" sx={{ ...userNameStyle }}>
                {points} điểm
              </Typography>{' '}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={2.5}>
          <Typography sx={{ ...dateAndScoreStyle }}>Điểm hiện tại: {currentScore}</Typography>
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

  const { data: donateHistories } = useQuery<DonateHistoryData>([`/donate/get-by-my-id`])
  return (
    <Card title="Donate history" hasMore={false}>
      {donateHistories?.data?.map((item, index) =>
        item.user_donate.id === userStorage?.id ? (
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
      {/* admin initial */}
      <HistoryItem
        currentScore={10}
        donateTime={userStorage?.created_at as any}
        points={10}
        isTakePoints={true}
        isAdminInitial={true}
      />
    </Card>
  )
}

const dateAndScoreStyle = {
  fontSize: { xs: 12, sm: 14 },
  opacity: 0.7,
}

const contentStyle = {
  fontSize: { xs: 14, sm: 16 },
  opacity: 0.7,
  lineHeight: { xs: 1.2, sm: 'unset' },
}

const userNameStyle = {
  fontSize: { xs: 15, sm: 17 },
  fontWeight: 700,
  lineHeight: { xs: 1.2, sm: 'unset' },
}
