import Error from 'next/error'
import {
  Box,
  Input,
  Divider,
  Card,
  Container,
  Text,
  Button,
  Heading,
  Flex,
  Select,
  Textarea,
  Field,
  Grid
} from 'theme-ui'
import Icon from '@hackclub/icons'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import manifest from '../../../manifest'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { returnLocalizedMessage, returnLocalizedQuestionText } from '../../../lib/helpers'

export default function ApplicationClub({
  notFound,
  applicationsRecord,
  leaderRecord,
  params
}) {
  const router = useRouter()
  const [data, setData] = useState(
    params.type == 'club' ? applicationsRecord.fields : leaderRecord.fields
  )
  const [saved, setSavedState] = useState(true)
  const poster = () => {
    fetch(
      `/api/${params.type}/save?id=${
        params.type == 'club' ? params.application : params.leader
      }`,
      { body: JSON.stringify(data), method: 'POST' }
    )
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          alert(`❌ ${returnLocalizedMessage(router.locale, 'ERROR')}`)
        } else {
          setSaved(true)
        }
      })
  }

  const savingStateRef = useRef(saved)
  const setSaved = data => {
    savingStateRef.current = data
    setSavedState(data)
  }

  useEffect(() => {
    window.addEventListener('beforeunload', function (e) {
      if (!savingStateRef.current) {
        e.preventDefault()
        e.returnValue = ''
      } else {
        delete e['returnValue']
      }
    })
  })

  async function goHome() {
    if (!savingStateRef.current) {
      await poster()
    }
    router.push(`/${params.application}/${params.leader}`)
  }

  if (notFound) {
    return <Error statusCode="404" />
  }
  return (
    <Container py={4} variant="copy">
      <Card
        px={[4, 4]}
        py={[3, 3]}
        sx={{
          color: 'blue',
          textAlign: 'left'
        }}
      >
        <Flex sx={{ alignItems: 'center', cursor: 'pointer' }}>
          <Icon glyph="home" onClick={goHome} />
          <Text
            variant="subheadline"
            sx={{ fontWeight: 400, mb: 0, flexGrow: 1, ml: 2 }}
            as="div"
          >
            <Text
              sx={{ textDecoration: 'none', color: 'blue' }}
              onClick={goHome}
            >
              {returnLocalizedMessage(router.locale, 'APPLY')}
            </Text>

            {' / '}
            <b>
              {params.type == 'club'
                ? returnLocalizedMessage(router.locale, 'CLUB')
                : returnLocalizedMessage(router.locale, 'LEADER')}
            </b>
          </Text>
          <Flex
            sx={{ alignItems: 'center', cursor: 'pointer' }}
            onClick={() => poster()}
          >
            <Button
              sx={{
                color: 'white',
                mr: 2,
                fontWeight: '800',
                textTransform: 'uppercase',
                bg: saved ? '#33d6a6' : '#ff8c37',
                ':hover,:focus': saved ? { transform: 'none' } : {},
              }}
            >
              {saved
                ? returnLocalizedMessage(router.locale, 'SAVED')
                : returnLocalizedMessage(router.locale, 'SAVE')}
            </Button>
            <Icon
              glyph={saved ? 'checkmark' : 'important'}
              color={saved ? '#33d6a6' : '#ff8c37'}
            />
          </Flex>
        </Flex>
      </Card>
      <Card px={[4, 4]} py={[4, 4]} mt={4}>
        {(params.type == 'club' ? manifest.clubs : manifest.leaders).map(
          (sectionItem, sectionIndex) => (
            <Box>
              <Box sx={{ textAlign: 'left' }}>
                <Text sx={{ color: 'red', fontSize: '27px', fontWeight: 800 }}>
                  {returnLocalizedQuestionText(router.locale, sectionItem, 'header')}
                </Text>
              </Box>
              <Box>
                {sectionItem.label && (
                  <Box sx={{ color: 'muted', mb: 3 }}>{returnLocalizedQuestionText(router.locale, sectionItem,'label')}</Box>
                )}
                {sectionItem.items.map((item, index) => (
                  <Box
                    mt={1}
                    mb={3}
                    key={'form-item-' + sectionIndex + '-' + index}
                  >
                    <Field
                      label={
                        <Text>
                          {returnLocalizedQuestionText(router.locale, item, 'label')}{' '}
                          <Text
                            sx={{
                              color: 'muted',
                              display: item.optional ? 'inline' : 'none'
                            }}
                          >
                            ({returnLocalizedMessage(router.locale, 'OPTIONAL')}
                            )
                          </Text>
                        </Text>
                      }
                      disabled={
                        applicationsRecord.fields['Submitted'] ? true : false
                      }
                      onChange={e => {
                        let newData = {}
                        newData[item.key] = e.target.value
                        setData({ ...data, ...newData })
                        setSaved(false)
                      }}
                      placeholder={item.placeholder}
                      as={
                        item.type == 'string'
                          ? Input
                          : item.type == 'paragraph'
                          ? Textarea
                          : Select
                      }
                      type={item.inputType}
                      name="email"
                      value={data[item.key] !== undefined ? data[item.key] : ''}
                      sx={{
                        border: '1px solid',
                        borderColor: 'rgb(221, 225, 228)'
                      }}
                      {...(item.type == 'select'
                        ? item.options
                          ? {
                              children: (
                                <>
                                  <option value="" disabled>
                                    {returnLocalizedMessage(
                                      router.locale,
                                      'SELECT_ONE'
                                    )}
                                  </option>
                                  {returnLocalizedQuestionText(router.locale, item,'options').map(option => (
                                    <option>{option}</option>
                                  ))}
                                </>
                              )
                            }
                          : {
                              children: (
                                <>
                                  <option value="" disabled>
                                    {returnLocalizedMessage(
                                      router.locale,
                                      'SELECT_ONE'
                                    )}
                                  </option>
                                  {applicationsRecord.fields[
                                    item.optionsKey
                                  ].map(option => (
                                    <option>{option}</option>
                                  ))}
                                </>
                              )
                            }
                        : {})}
                    />
                    {item.characters && (
                      <Text
                        sx={{ fontSize: '18px', color: 'muted', mt: 1 }}
                        as="p"
                      >
                        (
                        {returnLocalizedMessage(
                          router.locale,
                          'AIM_FOR_BETWEEN'
                        )}{' '}
                        {item.characters[0]}{' '}
                        {returnLocalizedMessage(router.locale, 'AND')}{' '}
                        {item.characters[1]}{' '}
                        {returnLocalizedMessage(router.locale, 'CHARS')}
                        {data[item.key] &&
                          ', ' +
                            data[item.key].split(' ').join('').length +
                            ' ' +
                            returnLocalizedMessage(router.locale, data[item.key].split(' ').join('').length == 1 ? 'CHAR' : 'CHARS') +
                            ' ' +
                            returnLocalizedMessage(router.locale, 'SO_FAR')}
                        )
                      </Text>
                    )}
                    {item.sublabel && (
                      <Text sx={{ fontSize: '16px', color: 'muted' }} as="p">
                        {returnLocalizedQuestionText(router.locale, item, 'sublabel')}
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )
        )}
        <Button
          sx={{
            mt: 3,
            width: '100%',
            textTransform: 'uppercase'
          }}
          variant="ctaLg"
          onClick={goHome}
        >
          {'<<'} {returnLocalizedMessage(router.locale, 'GO_BACK')}
        </Button>
      </Card>
    </Container>
  )
}

export async function getServerSideProps({ res, req, params }) {
  const {
    prospectiveLeadersAirtable,
    applicationsAirtable
  } = require('../../../lib/airtable')
  const cookies = nookies.get({ req })
  if (cookies.authToken) {
    try {
      const leaderRecord = await prospectiveLeadersAirtable.find(
        'rec' + params.leader
      )
      const applicationsRecord = await applicationsAirtable.find(
        'rec' + params.application
      )
      if (leaderRecord.fields['Accepted Tokens'].includes(cookies.authToken)) {
        return { props: { params, applicationsRecord, leaderRecord } }
      } else {
        res.statusCode = 302
        res.setHeader('Location', `/`)
        return
      }
    } catch (e) {
      res.statusCode = 302
      res.setHeader('Location', `/`)
      return
    }
  } else {
    res.statusCode = 302
    res.setHeader('Location', `/`)
    return
  }
}
