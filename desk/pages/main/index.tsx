import AllProducts from '@/src/components/units/main/categories/allProducts/AllProducts.container'
import Best from '@/src/components/units/main/categories/best/Best.container'
import Recent from '@/src/components/units/main/categories/recent/Recent.container'
import FollowingBoards from '@/src/components/units/main/categories/followingBoards/followingBoards.container'
import Like from '@/src/components/units/main/categories/like/Like.container'
import Youtube from '@/src/components/units/main/categories/youtube/Youtube.container'
import BoardsRegisterButton from '@/src/components/units/main/components/boardsRegisterButton'
import { useAuth } from '@/src/commons/hooks/useAuth'

export default function MainPage() {
  const { isLoggedIn } = useAuth()

  return (
    <>
      <Best />
      <Recent />
      {isLoggedIn && <FollowingBoards />}
      {isLoggedIn && <Like />}
      <Youtube />
      <AllProducts />
      <BoardsRegisterButton />
    </>
  )
}
