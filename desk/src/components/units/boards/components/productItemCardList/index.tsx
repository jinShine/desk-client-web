import {
  Box,
  Card,
  CardBody,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { ProductItemCardProps } from './types'

export default function ProductItemCardList(props: ProductItemCardProps) {
  return (
    <VStack align={'stretch'}>
      <Text
        fontSize={{ base: 'lg', lg: 'xl' }}
        fontWeight={800}
        color={useColorModeValue('dGray.dark', 'dGray.light')}
        pt={'10px'}>
        {props.title}
      </Text>
      <SimpleGrid columns={{ lg: 3, sm: 2 }} spacing={'10px'}>
        {props.products.map((product, index) => (
          <Box
            key={index}
            _hover={{ transform: 'scale(1.02)', filter: 'brightness(120%)' }}>
            <Link href={product.url} isExternal>
              <Card
                boxShadow={'md'}
                height={'320px'}
                bgColor={useColorModeValue('dGray.light', '#bababa1e')}>
                <CardBody>
                  <Image
                    height={'150px'}
                    width={'100%'}
                    objectFit={'cover'}
                    src={product.picture ?? ''}
                    borderRadius="lg"
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                  />
                  <Stack mt="6" spacing="3">
                    <Text
                      noOfLines={2}
                      fontSize={'18px'}
                      fontWeight={'800'}
                      height={'54px'}>
                      {product.name}
                    </Text>
                    <Text
                      noOfLines={2}
                      fontSize={'14px'}
                      color={useColorModeValue('dGray.dark', 'dGray.medium')}>
                      {product.description}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  )
}
