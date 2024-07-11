import Document, { Head, Html, Main, NextScript } from "next/document";
import { ThemeWrapper } from "../components/reusable/shadcn-ui/theme-wrapper";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <ThemeWrapper>
          <Main />
          <NextScript />
        </ThemeWrapper>
      </Html>
    );
  }
}

export default MyDocument;
