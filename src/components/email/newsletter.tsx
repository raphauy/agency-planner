import { Body, Container, Head, Hr, Html, Img, Link, Row, Section, Tailwind, Text } from "@react-email/components";

interface Props {
  content: string
  banner: string
  footerText: string
  footerLinkHref: string
  footerLinkText: string
  linkUnsubscribe: string
}

export default function Newsletter({ content, banner, footerText, footerLinkHref, footerLinkText, linkUnsubscribe }: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans text-gray-600 bg-gray-100">
          <div className="bg-white shadow-sm ">
            <Img
              src={banner}
              width="100%"
              height="auto"
              alt="Newsletter"
            />
            <Section className="my-6 text-[16px] leading-[23px] w-full">
              <div className="mx-6" dangerouslySetInnerHTML={{ __html: content }} />
              <Hr />
              <Row className="pb-4">
                <Text className="mx-6 whitespace-pre-line">
                  {footerText}
                </Text>
                <Link className="mx-6 mb-5" href={footerLinkHref}>
                  {footerLinkText}
                </Link>
                <Hr />
                <div className="w-full text-xs text-center">
                  <Link href={linkUnsubscribe} className="text-xs text-black underline">
                    Darse de baja
                  </Link>
                </div>
              </Row>
            </Section>
          </div>
        </Body>
      </Tailwind>
    </Html>
  )
}