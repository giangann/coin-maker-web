import { useAtom } from 'jotai'

import { userAtomWithStorage, userIsAdmin, userProfileImage } from '../atoms/authAtom'
import { settingAtom } from '../atoms/settingAtom'

const useAuth = () => {
  const [userStorage] = useAtom(userAtomWithStorage)
  const [userAvatar] = useAtom(userProfileImage)
  const [setting] = useAtom(settingAtom)
  const [isAdmin] = useAtom(userIsAdmin)
  return { userStorage, userAvatar, setting, isAdmin }
}

export { useAuth }
