import { Box, Stack, Typography } from '@mui/material'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiLike, BiTrash } from 'react-icons/bi'
import { BsFillChatRightTextFill } from 'react-icons/bs'
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs'
import { toast } from 'react-toastify'

import { GiftIcon } from '@/components'
import { Chip } from '@/components/Chip'
import { InforUser, ListComment } from '@/components/Interaction'
import { STATUS_LIKE, TAG_POST } from '@/constants'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { IPost, UserType } from '@/libs/types'
import { formatTimeDiff } from '@/libs/utils'
import { LoginDialog } from '@/screens/auth'
import { AlignGrid, green, grey, red } from '@/styles'

import { Text } from '../styled'

interface IPostProps extends IPost {
  user: UserType
  is_liked: boolean
  handleOpenPostGiftDialog: () => void
  handleChoosePost?: (post: any) => void
}

export const Post: React.FC<IPostProps> = ({
  id: post_id,
  user_id,
  coin_id,
  content,
  tag,
  count_like,
  count_comment,
  user,
  is_liked,
  is_donated,
  handleOpenPostGiftDialog,
  handleChoosePost,
  ...props
}) => {
  const { t } = useTranslation()
  const { userStorage } = useAuth()

  const [likeActive, setLikeActive] = useState<boolean>(is_liked)
  const [countComment, setCountComment] = useState<number>(count_comment || 0)
  const [countLike, setcountLike] = useState<number>(count_like || 0)
  const [isShowComment, setIsShowComment] = useState<boolean>(false)

  useEffect(() => {
    setCountComment(count_comment)
  }, [count_comment])

  const handleLike = async () => {
    if (!userStorage) {
      handleOpenDialog()
      return
    }

    try {
      const res = await request.post(`like/like`, {
        post_id,
        status: likeActive ? STATUS_LIKE['NO_REACT'] : STATUS_LIKE['LIKE'],
      })

      if (res.status == 200) {
        setLikeActive(!likeActive)
        setcountLike(likeActive ? countLike - 1 : countLike + 1)
      }
    } catch (error) {
      toast.error(t('error'))
    }
  }

  const handleDelete = async () => {
    try {
      const res = await request.delete(`post/${post_id}`)

      if (res.status == 200) {
        toast.success(t('delete_success'))

        queryClient.fetchQuery([`post/get-by-coin-id/${coin_id}?user_id=${userStorage?.id}`], {
          staleTime: 2000,
        })
      }
    } catch (error) {
      toast.error(t('delete_error'))
    }
  }

  const handlePostGift = async () => {
    const post = {
      user: user,
      postId: post_id,
    }

    handleChoosePost?.(post)
    handleOpenPostGiftDialog()
  }

  const handleToggleListComment = () => {
    setIsShowComment(!isShowComment)
  }

  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false)

  const handleCloseDialog = () => {
    setOpenLoginDialog(false)
  }

  const handleOpenDialog = () => {
    setOpenLoginDialog(true)
  }

  return (
    <>
      <Stack>
        <AlignGrid gap="32px" mb="12px">
          <InforUser
            user_name={user.name || ''}
            user_avatar={user?.avatar_url || ''}
            time={formatTimeDiff(props.updated_at)}
          />
          {tag != null && (
            <BoxTag
              startIcon={
                tag === TAG_POST['BULLISH'] ? (
                  <BsCaretUpFill size="14px" />
                ) : (
                  <BsCaretDownFill size="14px" />
                )
              }
              tag={tag}
            />
          )}
        </AlignGrid>
        <Typography>{content}</Typography>

        <AlignGrid gap="12px" mt="8px" ml="24px">
          <AlignGrid
            gap="6px"
            onClick={handleToggleListComment}
            sx={{
              cursor: 'pointer',
            }}
          >
            <BsFillChatRightTextFill color={grey['secondary']} size="12px" />
            {countComment ? <Text>{countComment}</Text> : null}
          </AlignGrid>

          <AlignGrid gap="4px" sx={{ cursor: 'pointer' }} onClick={handleLike}>
            <BiLike color={likeActive ? '#3490dc' : grey['secondary']} />
            {countLike ? <Text>{countLike}</Text> : null}
          </AlignGrid>

          {/* <AlignGrid gap="4px" sx={{ cursor: 'pointer' }} onClick={handleDislike}>
          <BiDislike color={dislikeActive ? '#3490dc' : grey['secondary']} />
          <Text>{dislike && `(${dislike})`}</Text>
        </AlignGrid> */}

          {userStorage?.id === user_id ? (
            <AlignGrid gap="4px" sx={{ cursor: 'pointer' }} onClick={handleDelete}>
              <BiTrash color={grey['secondary']} />
            </AlignGrid>
          ) : null}

          {userStorage?.id !== user_id ? (
            <Chip
              sx={{ backgroundColor: is_donated ? 'inherit' : 'none' }}
              startIcon={<GiftIcon />}
              content={is_donated ? t('post.donated') : t('post.donate')}
              isOutline
              hasHover
              handleClick={!is_donated ? handlePostGift : () => {}}
            />
          ) : null}

          {/* {userStorage?.id === user_id ? (
          <AlignGrid gap="4px" sx={{ cursor: 'pointer' }} onClick={handleEditPost}>
            <BiEdit />
            <Text>{t('edit')}</Text>
          </AlignGrid>
        ) : null} */}
        </AlignGrid>

        {isShowComment && (
          <Box sx={{ marginLeft: '24px' }}>
            <ListComment post_id={post_id} coin_id={coin_id} user_name={user.name as string} />
          </Box>
        )}
      </Stack>

      <LoginDialog open={openLoginDialog} handleClose={handleCloseDialog} />
    </>
  )
}

const BoxTag = ({ startIcon, tag }: { startIcon: ReactElement; tag: number }) => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: tag === TAG_POST['BULLISH'] ? green['primary'] : red['primary'],
      }}
    >
      {startIcon}
      <Typography sx={{ fontSize: '12px', marginLeft: '4px', fontWeight: 600 }}>
        {tag === TAG_POST['BULLISH'] ? t('bullish') : t('bearish')}
      </Typography>
    </Box>
  )
}
