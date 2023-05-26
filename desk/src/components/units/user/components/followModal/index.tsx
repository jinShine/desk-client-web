import InfiniteScroller from '@/src/components/ui/infiniteScroller'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Card,
  CardBody,
  Text,
  VStack,
  Flex,
  IconButton,
  Box,
  Divider,
  Avatar,
  useToast,
} from '@chakra-ui/react'
import { MdPersonOutline } from 'react-icons/md'
import { FollowModalProps } from './FollowModal.types'
import { useAuth } from '@/src/commons/hooks/useAuth'
import {
  TMutation,
  TMutationUpdateFollowingArgs,
  TQuery,
  TUser,
} from '@/src/commons/types/generated/types'
import { FETCH_FOLLOWEES, FETCH_FOLLOWINGS } from './FollowModal.queries'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { UPDATE_FOLLOWING } from '../../User.queries'
import { useEffect, useState } from 'react'

export default function FollowModal(props: FollowModalProps) {
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoggedIn, myUserInfo } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)

  const [updateFollowing] = useMutation<
    Pick<TMutation, 'updateFollowing'>,
    TMutationUpdateFollowingArgs
  >(UPDATE_FOLLOWING)

  const { data: followeesData, refetch: refetchFollowees } = useQuery<
    Pick<TQuery, 'fetchFollowees'>
  >(FETCH_FOLLOWEES, {
    variables: {
      FetchFollowees: {
        userid: props.userData.user.id as string,
        loginUserid: isLoggedIn ? myUserInfo?.id ?? '' : '',
      },
    },
  })
  const { data: followingsData, refetch: refetchFollowings } = useQuery<
    Pick<TQuery, 'fetchFollowings'>
  >(FETCH_FOLLOWINGS, {
    variables: {
      FetchFollowings: {
        userid: props.userData.user.id as string,
        loginUserid: isLoggedIn ? myUserInfo?.id ?? '' : '',
      },
    },
  })

  const followings = followingsData?.fetchFollowings ?? [] // 팔로우
  const followees = followeesData?.fetchFollowees ?? [] // 팔로워
  const followData = props.type === 'followee' ? followees : followings

  const refetchFollowData = async () => {
    await Promise.all([refetchFollowees(), refetchFollowings()])
  }

  useEffect(() => {
    refetchFollowData()
  }, [isFollowing])

  const onClickMoveToOtherUserPage = (userid: string) => () => {
    router.push(`/${userid}`)
    onClose()
  }

  const onClickIconButton = (userId: string, index: number) => async () => {
    const newFollowData = [...followData]
    const updatedItem = { ...newFollowData[index] }
    newFollowData[index] = updatedItem

    await updateFollowing({ variables: { followingid: userId } })
      .then(result => {
        const updateValue = result.data?.updateFollowing ?? false

        setIsFollowing(updateValue)
      })
      .catch(error => {
        if (error instanceof Error) {
          toast({
            title: '에러',
            description: `${error.message}`,
            status: 'error',
            position: 'top',
          })
        }
      })
  }

  return (
    <>
      <Text
        fontSize={{ base: '14px', md: '16px', lg: '18px' }}
        // fontSize="18px"
        fontWeight="600"
        cursor="pointer"
        _hover={{ bg: 'dGray.light' }}
        onClick={() => onOpen()}>
        {props.type === 'followee'
          ? `팔로워 ${followeesData?.fetchFollowees.length ?? 0}`
          : `팔로우 ${followingsData?.fetchFollowings.length ?? 0}`}
      </Text>

      <Modal onClose={onClose} size={{ base: 'sm', md: 'md' }} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="400px">
          <ModalHeader
            mx="auto"
            p="12px"
            fontSize={{ base: 'md', md: 'lg' }}
            alignContent="center">
            {props.type === 'followee' ? '팔로워' : '팔로우'}
          </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody p="12px 12px 8px" overflow="auto">
            <InfiniteScroller loadMore={() => console.log('더보기')} hasMore={true}>
              <VStack>
                {followData.map((data: TUser, index: number) => (
                  <Card key={data.id} w="100%" variant="elevated" px="10px">
                    <CardBody p="0px">
                      <Flex py="6px" justify="space-between" align="center">
                        <Flex align="center">
                          <Avatar
                            cursor="pointer"
                            onClick={onClickMoveToOtherUserPage(data.id)}
                            mr="10px"
                            name={data.nickName}
                            src={data.picture ?? 'https://bit.ly/broken-link'}
                          />
                          <VStack align="flex-start">
                            <Text
                              fontSize={{ base: 'sm', md: 'md' }}
                              fontWeight="600"
                              cursor="pointer"
                              onClick={onClickMoveToOtherUserPage(data.id)}>
                              {data.nickName}
                            </Text>
                            <Text fontSize="12px">{data.followeesCount} Connections</Text>
                          </VStack>
                        </Flex>
                        {isLoggedIn && (
                          <IconButton
                            variant="outline"
                            color={data.followingStatus ? 'white' : 'dPrimary'}
                            bg={data.followingStatus ? 'dPrimary' : 'white'}
                            borderColor="dPrimary"
                            _hover={{ color: 'dPrimary.dark' }}
                            onClick={onClickIconButton(data.id, index)}
                            border="2px"
                            aria-label="follow"
                            fontSize="25px"
                            icon={<MdPersonOutline />}
                          />
                        )}
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </InfiniteScroller>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
