import { maxWidth } from '@/src/commons/libraries/layout'
import { Box, Button, Center, Flex } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import ImageUpload from '../components/imageUpload'
import ItemLinkInput from '../components/itemLinkInput'
import JobGroupInput from '../components/jobGroupInput'
import TitleWithInput from '../components/titleWithInput'
import TitleWithInputTags from '../components/titleWithInputTags'
import { BoardsRegisterUIProps } from './Register.types'

const MIN_ITEMS_COUNT = 2

export default function BoardsRegisterUI(props: BoardsRegisterUIProps) {
  return (
    <Flex
      maxW={maxWidth.lg}
      direction={'column'}
      justify={'flex-start'}
      align={'stretch'}
      margin={'0 auto'}>
      <form onSubmit={props.useForm.handleSubmit(props.onClickSubmit)}>
        <Box mt={140}>
          <ImageUpload onChangeFileUrls={props.onChangeFileUrls} />
        </Box>
        <Box mt={'57px'}>
          <Controller
            name="title"
            control={props.useForm.control}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <TitleWithInput
                type="input"
                isRequired={true}
                title="제목을 입력해주세요."
                value={value || ''}
                maxLength={50}
                onChangeInput={onChange}
                errorMessage={errors.title?.message}
              />
            )}
          />
        </Box>
        <Box mt={'57px'}>
          <Controller
            name="deskIntroduce"
            control={props.useForm.control}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <TitleWithInput
                type="textarea"
                isRequired={true}
                title="책상을 자랑해주세요."
                value={value || ''}
                maxLength={500}
                inputHeight={300}
                onChangeInput={onChange}
                errorMessage={errors.deskIntroduce?.message}
              />
            )}
          />
        </Box>
        <Box mt={'57px'}>
          <Controller
            name="usingItems"
            control={props.useForm.control}
            render={({ field: { onChange, value }, formState: { errors } }) => {
              return (
                <ItemLinkInput
                  title="어떤 장비를 사용하시나요? (2개 이상)"
                  maxCount={MIN_ITEMS_COUNT}
                  isRequired={true}
                  onItems={onChange}
                  errorMessage={
                    errors.usingItems?.findLast?.(item => item) === undefined ||
                    '사용하시는 장비를 자랑해주세요.'
                  }
                />
              )
            }}
          />
        </Box>
        <Box mt={'57px'}>
          <Controller
            name="deskRecommendItem"
            control={props.useForm.control}
            render={({ field: { onChange, value } }) => (
              <TitleWithInput
                type="textarea"
                isRequired={false}
                title="더 추천하고 싶은 아이템이 있나요?"
                value={value || ''}
                maxLength={500}
                inputHeight={300}
                onChangeInput={onChange}
              />
            )}
          />
        </Box>
        <Box mt={'57px'}>
          <Controller
            name="hashTag"
            control={props.useForm.control}
            render={({ field: { onChange, value } }) => (
              <TitleWithInputTags
                type="input"
                isRequired={false}
                title="해시태그를 입력해주세요. ex) 학생데스크셋업, 개발자데스크셋업..."
                value={value || []}
                options={[
                  { value: '데스크셋업', label: '데스크셋업' },
                  { value: 'IT 개발자', label: 'IT 개발자' },
                  { value: '개발자 데스크셋업', label: '개발자 데스크셋업' },
                ]}
                onChangeInputTags={onChange}
              />
            )}
          />
        </Box>
        <Box mt={'57px'}>
          <Controller
            name="jobGroup"
            control={props.useForm.control}
            render={({ field: { onChange, value } }) => (
              <JobGroupInput title="직군을 선택해주세요." onItem={onChange} />
            )}
          />
        </Box>
        <Center mt={'80px'} mb={'80px'}>
          <Button type="submit" w={'40%'} h={'48px'} bgColor={'dPrimary'} color={'white'}>
            {props.isEdit ? '수정하기' : '등록하기'}
          </Button>
        </Center>
      </form>
    </Flex>
  )
}