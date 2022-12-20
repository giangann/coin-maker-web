import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TbTrashOff } from 'react-icons/tb'
import { toast } from 'react-toastify'

import { Button } from '@/components/Button'
import { InforUser } from '@/components/Interaction'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { IComment } from '@/libs/types'
import { formatTimeDiff } from '@/libs/utils'
import { AlignGrid, blue } from '@/styles'

interface ICommentProps extends IComment {
  coin_id: string | number
}

export const Comment: React.FC<ICommentProps> = ({
  coin_id,
  post_id,
  user_id,
  content,
  updated_at,
  id: comment_id,
  user,
  ...props
}) => {
  const { userStorage } = useAuth()
  const { t } = useTranslation()

  const handleDelete = async () => {
    try {
      const res = await request.delete(`comment/${comment_id}`)

      if (res.status == 200) {
        toast.success(res.data.message)

        queryClient.fetchQuery([`comment/get-by-post-id/${post_id}`], { staleTime: 2000 })
        queryClient.fetchQuery([`post/get-by-coin-id/${coin_id}?user_id=${userStorage?.id}`], {
          staleTime: 2000,
        })
      }
    } catch (error) {
      toast.error(t('delete_error'))
    }
  }

  return (
    <Stack mb="12px">
      <AlignGrid gap="32px" mb="8px">
        <InforUser
          user_name={user?.name || ''}
          user_avatar={user?.avatar_url || ''}
          time={formatTimeDiff(updated_at)}
        />
      </AlignGrid>
      <Typography sx={{ fontSize: '14px' }}>{content}</Typography>

      <AlignGrid gap="12px" mt="4px">
        {userStorage?.id == Number(user_id) ? (
          <Button
            sx={{ cursor: 'pointer', fontSize: '10px', textTransform: 'capitalize', width: '56px' }}
            onClick={handleDelete}
            startIcon={<TbTrashOff color={blue['primary']} size="14px" />}
            size="small"
            variant="outlined"
          >
            {t('delete')}
          </Button>
        ) : null}

        {/* {userStorage?.id == Number(user_id) ? (
          <AlignGrid gap="4px" sx={{ cursor: 'pointer' }} onClick={handleDelete}>
            <BiEdit color={grey['secondary']} />
          </AlignGrid>
        ) : null} */}
      </AlignGrid>
    </Stack>
  )
}
