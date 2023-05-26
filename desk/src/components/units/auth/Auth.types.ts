import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import * as yup from 'yup'

export type errMsg = {
  errText: string
  errColor: string
  isEmail: boolean
  verificationText: string
  verificationColor: string
  isVerified: boolean
  isSubmitButton: boolean
  myPassword: string
}

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('필수 입력값 입니다.')
    .email('이메일 형식으로만 입력이 가능합니다.'),
  password: yup
    .string()
    .required('필수 입력값 입니다.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,13}$/,
      '문자+숫자 조합 6~13자리의 비밀번호를 입력해주세요.',
    ),
})

export const signupSchema = yup.object({
  email: yup
    .string()
    .required('필수 입력값 입니다.')
    .email('이메일 형식으로만 입력이 가능합니다.'),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,13}$/,
      '문자+숫자 조합 6~13자리의 비밀번호를 입력해주세요.',
    )
    .required('필수 입력값 입니다.'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), undefined], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호를 재확인해주세요.'),
})

export type AuthFormProps = {
  email: string
  password: string
  passwordConfirm?: string
}

export type MyJob = {
  myJob: string
  setMyJob: Dispatch<SetStateAction<string>>
  // onChange?: (myJob: string) => void
  onChange?: (myJob: string) => void
  onChangeInputEdited?: () => void
  onChangeInputNotEdited?: (
    event: ChangeEvent<HTMLInputElement>,
    defaultData: any,
  ) => void
}

const ErrorLog = {
  NOT_EMAIL: '올바르지 않은 이메일 형식입니다.',
  ALREADY_USED_EMAIL: '이미 사용 중인 이메일입니다.',
  NOT_JOINED_MEMBER: '등록되지 않은 회원 입니다.',
  NOT_MATCH_PASSWORD: '비밀번호가 일치하지 않습니다.',
  SERVER_ERROR: '서버응답에 문제가 있습니다.',
}
Object.freeze(ErrorLog)

export function errorMessage(err: string) {
  if (err.includes('올바르지 않은')) {
    return ErrorLog.NOT_EMAIL
  } else if (err.includes('이미 사용중인')) {
    return ErrorLog.ALREADY_USED_EMAIL
  } else if (err.includes('등록되지 않은')) {
    return ErrorLog.NOT_JOINED_MEMBER
  } else if (err.includes('비밀번호가 일치')) {
    return ErrorLog.NOT_MATCH_PASSWORD
  } else if (err.includes('Failed')) {
    return ErrorLog.SERVER_ERROR
  }
}

export type TAuthModalType =
  | 'LOGIN'
  | 'SIGNUP'
  | 'LOGOUT'
  | 'SIGNOUT'
  | 'AFTER_AUTH'
  | 'FORGOT_PASSWORD'
  | ''
  | undefined
