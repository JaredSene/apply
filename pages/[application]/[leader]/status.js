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
  Grid
} from 'theme-ui'
import Icon from '@hackclub/icons'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import nookies, { destroyCookie } from 'nookies'
import { returnLocalizedMessage } from '../../../lib/helpers'
import TimelineCard from '../../../components/Timeline'
import ConfettiOnSuccess from '../../../components/ConfettiOnSuccess'

export default function ApplicationOnboarding({
  notFound,
  params,
  applicationsRecord,
  leaderRecord,
  trackerRecord
}) {
  const router = useRouter()
  const [applicationMessage, setApplicationMessage] = useState(
    returnLocalizedMessage(router.locale, 'PROCESSING')
  )
  const [messageColor, setMessageColor] = useState('#000000')
  const applicationStatus = trackerRecord[0]?.fields.Status
  if (notFound) {
    return <Error statusCode="404" />
  }
  console.log(applicationStatus)
  useEffect(() => {
    {
      applicationStatus === 'applied'
        ? (setApplicationMessage(
            `${returnLocalizedMessage(router.locale, 'IS_BEING_REVIEWED')}`
          ),
          setMessageColor('#000000'))
        : applicationStatus === 'rejected'
        ? (setApplicationMessage(
            `${returnLocalizedMessage(router.locale, 'REJECTED')}`
          ),
          setMessageColor('#ec3750'))
        : applicationStatus === 'awaiting onboarding'
        ? (setApplicationMessage(
            `${returnLocalizedMessage(router.locale, 'ACCEPTED')}`
          ),
          setMessageColor('#33d6a6'))
        : applicationStatus === 'onboarded'
        ? (setApplicationMessage(
            `${returnLocalizedMessage(router.locale, 'ACCEPTED')}`
          ),
          setMessageColor('#33d6a6'))
        : (setApplicationMessage(
            `${returnLocalizedMessage(router.locale, 'PROCESSING')}`
          ),
          setMessageColor('#000000'))
    }
  }, [])

  console.log(trackerRecord[0]?.fields['Status'])

  useEffect(() => {
    if (
      applicationsRecord.fields['Submitted'] === undefined ||
      applicationsRecord.fields['Submitted'] === null
    ) {
      if (applicationsRecord.fields['All Complete (incl Leaders)'] === 1) {
        setApplicationMessage('Incomplete. Redirecting...')
        setTimeout(() => {
          router.push(`/${params.application}/${params.leader}/review`)
        }, 1000)
      }
    } else if (
      trackerRecord[0]?.fields.Status === undefined &&
      applicationsRecord.fields['Submitted']
    ) {
      setTimeout(() => {
        router.reload()
      }, 500)
    }
  }, [applicationStatus])

  return (
    <Container
      py={4}
      variant="copy"
      sx={{
        overflowY: 'hidden',
        overflowX: 'hidden'
      }}
    >
      {applicationStatus != 'rejected' && applicationStatus != null ? (
        <ConfettiOnSuccess applicationStatus={applicationStatus} />
      ) : null}

      <TimelineCard
        router={router}
        applicationsRecord={applicationsRecord}
        leaderRecord={leaderRecord}
        trackerRecord={trackerRecord}
        params={params}
      />
      <Card px={[4, 4]} py={[4, 4]} mt={1}>
        <Heading
          sx={{ fontSize: [3, 4], textAlign: 'center', alignItems: 'center' }}
          as="h2"
        >
          <Text
            sx={{
              color: messageColor,
              textAlign: 'center',
              alignItems: 'center'
            }}
          >
            {returnLocalizedMessage(router.locale, 'YOUR_APPLICATION')}{' '}
            {applicationMessage}
          </Text>
        </Heading>
        <Divider sx={{ color: 'slate', my: [3, 4] }} />

        {applicationStatus === 'applied' ? (
          <>
            <Box sx={{ fontSize: [1, 2], mb: '30px' }}>
              <Text>
                {returnLocalizedMessage(router.locale, 'EYE_ON_EMAIL')}
              </Text>
            </Box>
            <Heading sx={{ fontSize: [2, 3] }} as="h4">
              <Text>
                {returnLocalizedMessage(router.locale, 'WHILE_YOU_WAIT')}
              </Text>
            </Heading>
            <Box
              style={{
                marginTop: '1rem'
              }}
            >
              <Text>
                {returnLocalizedMessage(router.locale, 'ZEPHYR_DETAILS')}
              </Text>
              <Box sx={{ my: '15px' }}>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/2BID8_pGuqA"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </Box>
            </Box>

            <Box
              style={{
                marginTop: '1rem'
              }}
            >
              <Text>
                {returnLocalizedMessage(router.locale, 'SLACK_DETAILS_FRONT')}{' '}
                <Link href="https://hackclub.com/slack">
                  {returnLocalizedMessage(
                    router.locale,
                    'SLACK_DETAILS_MIDDLE'
                  )}
                </Link>{' '}
                {returnLocalizedMessage(router.locale, 'SLACK_DETAILS_END')}
              </Text>
              <video autoPlay muted width="560" height="250">
                <source
                  src="https://cdn.glitch.me/2d637c98-ed35-417a-bf89-cecc165d7398%2Foutput-no-duplicate-frames.hecv.mp4"
                  type="video/mp4"
                />
              </video>
            </Box>
          </>
        ) : applicationStatus === 'rejected' ? (
          <>
            <Heading sx={{ fontSize: [2, 3] }} as="h4">
              <Text>
                {returnLocalizedMessage(
                  router.locale,
                  'PLEASE_REACH_OUT_REJECTION'
                )}
              </Text>
            </Heading>
          </>
        ) : applicationStatus === 'awaiting onboarding' ? (
          <>
            <Heading sx={{ fontSize: [2, 3], mb: '30px' }} as="h3">
              <Text>
                {returnLocalizedMessage(router.locale, 'EXCITED_TO_HAVE_YOU')}
              </Text>
            </Heading>
            <Box sx={{ fontSize: [1, 2], mb: '30px' }}>
              <Text>
                {returnLocalizedMessage(router.locale, 'SCHEDULED_ONBOARDING')}{' '}
                <b>
                  {trackerRecord[0].fields['Ambassador'] === 'HQ'
                    ? 'Holly from HQ.'
                    : trackerRecord[0].fields['Ambassador'] === 'APAC'
                    ? 'Anna and Harsh from Hack Club APAC.'
                    : 'Hack Club HQ.'}
                </b>{' '}
                {returnLocalizedMessage(
                  router.locale,
                  'CHECK_YOUR_EMAIL_ONBOARDING'
                )}
              </Text>
            </Box>
            <Box sx={{ mb: '30px' }}>
              <img
                width="70%"
                height="100%"
                src="https://telltaletv.com/wp-content/uploads/2016/08/picture-of-seinfeld-group-jumping-at-the-door-gif.gif"
              />
            </Box>
          </>
        ) : applicationStatus === 'onboarded' ? (
          <>
            <Heading sx={{ fontSize: [2, 3], mb: '30px' }} as="h3">
              <Text>
                {returnLocalizedMessage(router.locale, 'EXCITED_TO_HAVE_YOU')}
              </Text>
            </Heading>
            <Box sx={{ fontSize: [1, 2], mb: '30px' }}>
              <Text>
                {returnLocalizedMessage(router.locale, 'COMPLETE_MESSAGE')}
              </Text>
            </Box>
            <Box sx={{ mb: '30px' }}>
              <img
                width="60%"
                height="100%"
                src="https://media-exp1.licdn.com/dms/image/C4E22AQG_keow32-aVQ/feedshare-shrink_2048_1536/0/1632869420418?e=2147483647&v=beta&t=245AFJt0i_YVl5VibSxjuHRGMIWt7Z5J14Gr0vA_DlA"
              />
            </Box>
          </>
        ) : (
          <>{returnLocalizedMessage(router.locale, 'ONE_MOMENT')}</>
        )}
      </Card>
      <Box
        sx={{
          display: ['none', 'flex'],
          position: 'fixed',
          left: '10px',
          bottom: '10px',
          cursor: 'pointer',
          placeItems: 'center',
          background: '#00000002',
          px: 2,
          borderRadius: '15px'
        }}
        onClick={async () => {
          await destroyCookie(null, 'authToken', {
            path: '/'
          })
          router.push('/', '/', { scroll: false })
        }}
      >
        <Icon
          glyph="door-leave"
          style={{
            color: '#000000',
            opacity: 0.8
          }}
        />
        <Text
          sx={{
            color: '#000000',
            fontWeight: '800',
            textTransform: 'uppercase',
            opacity: 1,
            transition: '0.5s ease-in-out',
            mx: '5px',
            ':hover,:focus': {
              opacity: 1,
              transition: '0.5s ease-in-out',
              color: '#ec3750'
            }
          }}
        >
          {returnLocalizedMessage(router.locale, 'LOGOUT')}
        </Text>
      </Box>
      <ContactCard router={router} />
      <OpenSourceCard router={router} />
    </Container>
  )
}

const ContactCard = ({ router }) => (
  <Card
    px={[4, 4]}
    py={[3, 3]}
    mt={3}
    sx={{
      color: 'blue',
      display: 'flex',
      alignItems: 'center',
      '> svg': { display: ['none', 'inline'] }
    }}
  >
    <Icon glyph="message" />
    <Text sx={{ ml: 2 }}>
      {returnLocalizedMessage(router.locale, 'CONTACT_MESSAGE_FRONT')}{' '}
      <b>
        <Text
          as="a"
          href={`mailto:${returnLocalizedMessage(
            router.locale,
            'CONTACT_EMAIL'
          )}`}
          sx={{
            color: 'blue',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              textDecorationStyle: 'wavy'
            }
          }}
        >
          {returnLocalizedMessage(router.locale, 'CONTACT_EMAIL')}
        </Text>
      </b>{' '}
      {returnLocalizedMessage(router.locale, 'CONTACT_MESSAGE_BACK')}
    </Text>
  </Card>
)

export async function getServerSideProps({ res, req, params }) {
  const {
    prospectiveLeadersAirtable,
    applicationsAirtable,
    trackerAirtable
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
      const trackerRecord = await trackerAirtable.read({
        filterByFormula: `{App ID} = "rec${params.application}"`,
        maxRecords: 1
      })
      if (leaderRecord.fields['Accepted Tokens'].includes(cookies.authToken)) {
        return {
          props: { params, applicationsRecord, leaderRecord, trackerRecord }
        }
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

const OpenSourceCard = ({ router }) => {
  return (
    <Box
      sx={{
        display: ['none', 'flex'],
        position: 'fixed',
        right: '10px',
        bottom: '10px',
        cursor: 'pointer',
        placeItems: 'center',
        background: '#00000002',
        px: 2,
        borderRadius: '15px'
      }}
    >
      <Text
        sx={{
          color: '#ec3750',
          fontWeight: '800',
          textTransform: 'uppercase',
          transition: '0.5s ease-in-out',
          opacity: 1,
          mx: '5px',
          ':hover,:focus': {
            opacity: 1,
            transition: '0.5s ease-in-out',
            color: '#ec3750'
          }
        }}
      >
        <a
          target="_blank"
          href="https://github.com/hackclub/apply"
          style={{ textDecoration: 'none' }}
        >
          <Text
            sx={{
              textDecoration: 'none',
              color: '#ec3750',
              opacity: 0.8,
              transition: '0.2s ease-in-out',
              '&:hover': {
                opacity: 1,
                transition: '0.2s ease-in-out'
              }
            }}
          >
            {returnLocalizedMessage(router.locale, 'PROUDLY_OPEN_SOURCE')}
          </Text>
        </a>
      </Text>
      <a
        target="_blank"
        href="https://github.com/hackclub/apply"
        style={{ textDecoration: 'none' }}
      >
        <Icon
          glyph="github"
          style={{
            color: '#000000',
            opacity: 0.8
          }}
        />
      </a>
    </Box>
  )
}
