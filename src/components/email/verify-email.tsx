import { Body, Container, Head, Heading, Html, Img, Link, Section, Text } from "@react-email/components";
import * as React from "react";

interface CodeVerifyEmailProps {
  validationCode: string;
  sotreName: string;
  contactEmail: string;
}

export const CodeVerifyEmail = ({ validationCode, sotreName, contactEmail }: CodeVerifyEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://res.cloudinary.com/dcy8vuzjb/image/upload/v1713885570/demo-store/248451668_2739383413037833_764397266421891032_n.jpg_i6wwz2.jpg"
          width="50"
          height="50"
          alt="Latidio"
          style={logo}
        />
        <Text style={tertiary}>Verifica tu email</Text>
        <Heading style={secondary}>
          Ingresa el siguiente código para verificar tu email en Agency Planner para {sotreName}.
        </Heading>
        <Section style={codeContainer}>
          <Text style={code}>{validationCode}</Text>
        </Section>
        <Text style={paragraph}>No solicitaste este email?</Text>
        <Text style={paragraph}>
          Por favor avísanos en{" "}
          <Link href={`mailto:${contactEmail}`} style={link}>
            {contactEmail}
          </Link>{" "}
        </Text>
      </Container>
      <Text style={footer}>Un servicio de{" "}
        <Link href="https://agency-planner.com/" style={link}>
            Agency Planner
        </Link>
      </Text>
    </Body>
  </Html>
);

CodeVerifyEmail.PreviewProps = {
  validationCode: "144833",
  sotreName: "Uruguay en Vinos",
  contactEmail: "soporte@agency-planner.com",
} as CodeVerifyEmailProps;

export default CodeVerifyEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  maxWidth: "390px",
  margin: "0 auto",
  padding: "68px 10px 130px",
};

const logo = {
  margin: "0 auto",
  borderRadius: "50%",
  border: "1px solid rgba(128,128,128,0.2)",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "0",
  textAlign: "center" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
};

const code = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Bold",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "6px",
  lineHeight: "40px",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};

const footer = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "23px",
  margin: "0",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};
