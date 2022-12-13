import { Stack } from '@mui/material'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { BaseDialog } from '@/components/Dialog/BaseDialog'
import { DEFAULT_POINTS_DONATE } from '@/constants'
import { userAtomWithStorage } from '@/libs/atoms'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { IPost, UserType } from '@/libs/types'
import { backgroundColor } from '@/styles'

import { Post } from './Post'
interface IListPost {
  coin_id: string
}

interface IListPostResponse {
  data: IPost[]
}

type PostInfo = {
  user: UserType
  postId: number | string
}

export const ListPost: React.FC<IListPost> = ({ coin_id }) => {
  const [userStorage, setUserStorage] = useAtom(userAtomWithStorage)
  // console.log('userStorage', userStorage)
  const [openDialog, setOpenDialog] = useState(false)
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null)
  const { data: posts, isLoading } = useQuery<IListPostResponse>([
    `post/get-by-coin-id/${coin_id}?user_id=${userStorage?.id}`,
  ])
  const { t } = useTranslation()
  const handleChoosePost = (post: PostInfo) => {
    setPostInfo(post)
  }

  const handleDonate = async () => {
    try {
      const res = await request.post('/donate/donate', {
        post_id: postInfo?.postId,
        user_donate_id: userStorage?.id,
        user_take_id: postInfo?.user.id,
        points: DEFAULT_POINTS_DONATE,
      })
      // console.log('res', res)
      setUserStorage({
        ...userStorage,
        score: res.data.data.user_donate_curr_score,
      } as any)
      queryClient.fetchQuery([`post/get-by-coin-id/${coin_id}?user_id=${userStorage?.id}`], {
        staleTime: 2000,
      })
      if (res.status === 200) {
        toast.success(res.data.message)
      }
    } catch (error: any) {
      toast.error(error)
    }
    handleClose()
  }
  const handleClose = () => {
    setOpenDialog(false)
  }

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        !!posts?.data?.length && (
          <Stack
            spacing={3}
            sx={{
              backgroundColor: backgroundColor['post'],
              padding: '20px',
              borderRadius: '8px',
              marginTop: '24px',
              gap: '32px',
            }}
          >
            {posts.data.map((item: IPost) => (
              <Post
                handleChoosePost={handleChoosePost}
                handleOpenPostGiftDialog={() => setOpenDialog(true)}
                key={item.id}
                {...item}
              />
            ))}
          </Stack>
        )
      )}

      <BaseDialog
        open={openDialog}
        handleClose={handleClose}
        title={t('post.donate_confirm_title')}
        handleSubmit={handleDonate}
        submitAction={t('post.donate')}
      >
        {t('post.donate_confirm_content')} {postInfo?.user?.name}?
      </BaseDialog>
    </>
  )
}
