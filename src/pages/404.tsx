import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function FourOFour() {
  return (
    <>
      <Head>
        <title>Oops!</title>
        <meta name="description" content="404 Error" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen items-end justify-start bg-white dark:bg-black">
        <span className="">
          <Image
            className="hidden h-[125px] w-[300px] object-cover dark:flex md:h-[225px] md:w-[550px]"
            src="/illustrations/404-dark.svg"
            width={100}
            height={100}
            priority
            alt="Fuxam GmbH"
          />
          <Image
            className="h-[125px] w-[300px] object-cover dark:hidden md:h-[225px] md:w-[550px]"
            src="/illustrations/404-light.svg"
            width={100}
            height={100}
            priority
            alt="Fuxam GmbH"
          />
        </span>
        <div className="absolute flex h-screen w-screen items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <p className="text-4xl font-bold tracking-tight text-fuxam-pink sm:text-5xl">
                404
              </p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold tracking-tight text-contrast sm:text-5xl">
                    <p>We looked everywhere,</p>
                    <p>but we couldn&apos;t find that page.</p>
                  </h1>
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-md border border-transparent bg-fuxam-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-fuxam-pink-600 focus:outline-none"
                  >
                    Go back home
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </main>
    </>
  );
}
