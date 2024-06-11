import { Body, Container, Head, Heading, Html, Img, Link, Section, Text, Button, Column, Hr, Preview, Row, Tailwind } from "@react-email/components";
import * as React from "react";

type InviteUserEmailProps= {
  username?: string;
  agencyName?: string;
  agencyImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}` : "http://localhost:3000"

export const InviteUserEmail = ({
  username,
  agencyName,
  agencyImage,
  invitedByUsername,
  invitedByEmail,
  teamName,
  teamImage,
  inviteLink,
}: InviteUserEmailProps) => {
  const previewText = `Únete a ${teamName} en Agency Planner`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/favicon.ico`}
                width="40"
                height="37"
                alt="Agency Planner"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Únete al equipo de <strong>{teamName}</strong> y <strong>{agencyName}</strong> en <strong>Agency Planner</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hola {username},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) te ha invitado al equipo de <strong>{teamName}</strong> y <strong>{agencyName}</strong>
              {" "}en{" "} <strong>Agency Planner</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={teamImage}
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <Img
                    src={`${baseUrl}/arrow-right.png`}
                    width="12"
                    height="9"
                    alt="->"
                  />                  
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={agencyImage}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Aceptar invitación
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              o copia y pega esta URL en tu navegador:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Esta invitación fue enviada a {" "}
              <span className="text-black">{username}</span>. Si no estabas esperando 
              esta invitación, puedes ignorarla.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InviteUserEmail.PreviewProps = {
  username: "alanturing",
  agencyName: "Tinta",
  agencyImage: `${baseUrl}/tinta-icon.png`,
  userImage: `${baseUrl}/user-placeholder.jpg`,
  invitedByUsername: "Alan",
  invitedByEmail: "alan.turing@example.com",
  teamName: "Tinta",
  teamImage: `${baseUrl}/tinta-icon.png`,
  inviteLink: "https://agency-planner.com/auth/login?email=rapha.uy@rapha.uy",
} as InviteUserEmailProps;

export default InviteUserEmail;
