import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

import { SetStateAction, useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useMutation } from '@apollo/client'
import {
  AUTH_EMAIL,
  CREATE_USER,
  MATCH_AUTH_NUMBER,
} from '@/src/components/units/auth/queries/mutation'
import {
  AuthFormProps,
  errMsg,
  errorMessage,
  signupSchema,
} from '@/src/components/units/auth/Auth.types'
import Login from '@/src/components/units/auth/login/Login.container'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import MyJobSelect from '@/src/components/units/auth/signup/components/MyJobSelect'
import Timer from '@/src/components/ui/timer'
import CustomSpinner from '@/src/components/ui/spinner'

export default function SignupForm() {
  const [errMsg, setErrMsg] = useState<errMsg>({
    errText: '',
    errColor: '',
    isEmail: false,
    verificationText: '',
    verificationColor: '',
    isVerified: false,
    isSubmitButton: false,
    myPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [myJob, setMyJob] = useState('')
  const [createUser] = useMutation(CREATE_USER)
  const [authEmail] = useMutation(AUTH_EMAIL)
  const [matchAuthNumber] = useMutation(MATCH_AUTH_NUMBER)
  const [pinNumber, setPinNumber] = useState<string | undefined>(undefined)
  const [authType, setAuthType] = useState('authSignup')
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormProps>({
    resolver: yupResolver(signupSchema),
    mode: 'onChange',
  })
  const [timeReset, setTimeReset] = useState(0)
  const [isPending, setIsPending] = useState({ email: false })

  const bgColor = {
    whiteAndGray700: useColorModeValue('white', 'gray.700'),
    gray200AndGray600: useColorModeValue('gray.200', 'gray.600'),
  }
  const color = {
    gray600AndGray300: useColorModeValue('gray.600', 'gray.300'),
    dPrimaryAndDprimaryHoverTransparency: useColorModeValue(
      'dPrimary',
      'dPrimaryHover.transparency',
    ),
  }

  const onChangePinNumber = (props: SetStateAction<string | undefined>): void => {
    setPinNumber(props)
  }

  const onClickCertification = async () => {
    setIsPending({ email: true })
    const data = getValues()
    await authEmail({
      variables: {
        authEmailInput: {
          email: data.email,
          authCheck: true,
        },
      },
    })
      .then(() => {
        const msg = '인증할 이메일 확인 후 인증번호 6자리를 입력해 주세요'
        setErrMsg({ ...errMsg, errText: msg, errColor: 'green', isEmail: true })
        setTimeReset(Math.floor(Math.random() * 1000))
        setIsPending({ email: false })
      })
      .catch(err => {
        const msg: string | undefined = errorMessage(err.message)
        setErrMsg({ ...errMsg, errText: msg || '', errColor: 'red' })
        setIsPending({ email: false })
      })
  }

  const onClickMatchAuthNumber = async () => {
    const data = getValues()
    await matchAuthNumber({
      variables: {
        matchAuthInput: {
          email: data.email,
          authNumber: pinNumber,
        },
      },
    })
      .then(() => {
        const msg = '인증번호가 일치합니다.'
        setErrMsg({
          ...errMsg,
          verificationText: msg,
          verificationColor: 'green',
          isVerified: true,
        })
      })
      .catch(() => {
        const msg = '인증번호가 일치하지 않습니다.'
        setErrMsg({ ...errMsg, verificationText: msg, verificationColor: 'red' })
      })
  }

  const onClickSubmit = async (data: AuthFormProps) => {
    await createUser({
      variables: {
        createUserInput: {
          email: data.email,
          password: data.password,
          jobGroup: myJob,
        },
      },
    })
      .then(() => {
        setAuthType('authLogin')
      })
      .catch(() => {
        const errorMsg: string = '이미 사용 중인 이메일입니다.' as const
        setErrMsg({ ...errMsg, errText: errorMsg, errColor: 'red' })
        return
      })
  }

  return (
    <>
      {authType === 'authSignup' && (
        <Flex align={'center'} justify={'center'}>
          <Stack spacing={0} mx={'auto'} maxW={'lg'} bg={bgColor.whiteAndGray700}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'} pt={6}>
                회원가입
              </Heading>
              <Text fontSize={'lg'} color={color.gray600AndGray300}>
                당신의 책상을 자랑하십시오{' '}
                <Link color={color.dPrimaryAndDprimaryHoverTransparency} href={'/'}>
                  데카이브
                </Link>{' '}
                ✌️
              </Text>
              의
            </Stack>
            <Box rounded={'lg'} bg={bgColor.whiteAndGray700} p={8}>
              <form onSubmit={handleSubmit(onClickSubmit)}>
                <Stack spacing={4}>
                  <MyJobSelect setMyJob={setMyJob} myJob={myJob} />
                  <FormControl id="email" isInvalid={!!errors.email}>
                    <FormLabel>이메일</FormLabel>
                    <Flex gap={4}>
                      <Input
                        focusBorderColor={'dPrimary'}
                        type="email"
                        autoFocus={!!myJob}
                        placeholder={'이메일을 입력해 주세요.'}
                        {...register('email')}
                      />
                      {!isPending.email && (
                        <Button
                          onClick={onClickCertification}
                          loadingText="Submitting"
                          size="md"
                          px={6}
                          disabled
                          bg={'dPrimary'}
                          color={'white'}
                          isDisabled={!myJob}
                          _hover={{ bg: 'dPrimaryHover.dark' }}>
                          인증번호 받기
                        </Button>
                      )}
                      {isPending.email && (
                        <Box w={164} ml={0}>
                          <CustomSpinner />
                        </Box>
                      )}
                    </Flex>
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                    <Text color={errMsg.errColor} pb={4}>
                      {errMsg.errText}
                    </Text>
                    {errMsg.errText.includes('인증') ? (
                      <Text>
                        인증번호 유효시간은 <Timer mm={timeReset} ss={0} /> 입니다.
                      </Text>
                    ) : (
                      ''
                    )}
                  </FormControl>
                  <FormControl id="certificationNumber">
                    <FormLabel>인증번호</FormLabel>
                    <Flex gap={1.5}>
                      <PinInput
                        focusBorderColor={'dPrimary'}
                        onChange={onChangePinNumber}>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                      </PinInput>
                      <Button
                        onClick={onClickMatchAuthNumber}
                        loadingText="Submitting"
                        size="md"
                        bg={'dPrimary'}
                        isDisabled={!errMsg.isEmail}
                        color={'white'}
                        _hover={{ bg: 'dPrimaryHover.dark' }}>
                        인증하기
                      </Button>
                    </Flex>
                    <Text color={errMsg.verificationColor} pb={4}>
                      {errMsg.verificationText}
                    </Text>
                  </FormControl>
                  <FormControl id="password" isInvalid={!!errors.password}>
                    <FormLabel>비밀번호</FormLabel>
                    <InputGroup>
                      <Input
                        focusBorderColor={'dPrimary'}
                        type={showPassword ? 'text' : 'password'}
                        isReadOnly={!errMsg.isVerified}
                        placeholder={'숫자인증 후 비밀번호 입력 가능합니다.'}
                        {...register('password')}
                      />
                      <InputRightElement h={'full'}>
                        <Button
                          variant={'ghost'}
                          onClick={() => setShowPassword(showPassword => !showPassword)}>
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl id="passwordConfirm" isInvalid={!!errors.passwordConfirm}>
                    <FormLabel>비밀번호 재확인</FormLabel>
                    <InputGroup>
                      <Input
                        focusBorderColor={'dPrimary'}
                        type={'password'}
                        isReadOnly={!errMsg.isVerified}
                        placeholder={'비밀번호를 확인해 주세요.'}
                        {...register('passwordConfirm')}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.passwordConfirm && errors.passwordConfirm.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Stack spacing={10} pt={2}>
                    <Button
                      type={'submit'}
                      loadingText="Submitting"
                      size="lg"
                      bg={'dPrimary'}
                      isDisabled={!!errors.password}
                      color={'white'}
                      _hover={{ bg: 'dPrimaryHover.dark' }}>
                      회원가입
                    </Button>
                  </Stack>
                  <Stack pt={6}>
                    <Text align={'center'} style={{ color: 'dPrimary' }}>
                      이미 회원이신가요?{' '}
                      <Link
                        color={color.dPrimaryAndDprimaryHoverTransparency}
                        onClick={() => {
                          setAuthType('authLogin')
                        }}>
                        로그인
                      </Link>
                    </Text>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      )}
      {authType === 'authLogin' && <Login />}
    </>
  )
}