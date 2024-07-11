import { ChevronRight, Mail, Video } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { toast } from "../components/reusable/toaster/toast";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Oops! | Error Found</title>
        <meta name="description" content="500 Error" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Example />
    </>
  );
}

const links = [
  {
    name: "Schedule Support call",
    href: "https://outlook.office.com/bookwithme/user/f4ee5549a41d4266bf842c89cbfe287f%40fuxam.de/meetingtype/bVzkHRDGwEOaDufyH-Zl1Q2?anonymous",
    description: "Learn how to integrate our tools with your app.",
    icon: Video,
  },
  {
    name: "Send us an email",
    href: "mailto:support@fuxam.de",
    description: "A complete API reference for our libraries.",
    icon: Mail,
  },
  {
    name: "Watch tutorials",
    href: "#",
    description: "Installation guides that cover popular setups.",
    icon: (props) => (
      <svg
        {...props}
        className=" h-6 w-6 fill-fuxam-pink"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 1"
        viewBox="0 0 24 24"
      >
        <path d="M23,9.71a8.5,8.5,0,0,0-.91-4.13,2.92,2.92,0,0,0-1.72-1A78.36,78.36,0,0,0,12,4.27a78.45,78.45,0,0,0-8.34.3,2.87,2.87,0,0,0-1.46.74c-.9.83-1,2.25-1.1,3.45a48.29,48.29,0,0,0,0,6.48,9.55,9.55,0,0,0,.3,2,3.14,3.14,0,0,0,.71,1.36,2.86,2.86,0,0,0,1.49.78,45.18,45.18,0,0,0,6.5.33c3.5.05,6.57,0,10.2-.28a2.88,2.88,0,0,0,1.53-.78,2.49,2.49,0,0,0,.61-1,10.58,10.58,0,0,0,.52-3.4C23,13.69,23,10.31,23,9.71ZM9.74,14.85V8.66l5.92,3.11C14,12.69,11.81,13.73,9.74,14.85Z" />
      </svg>
    ),
    isDifferent: true,
  },
];

function Example() {
  return (
    <div className="bg-offwhite-1 dark:bg-offblack-1">
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
        <Image
          src="/logo.svg"
          width={50}
          height={50}
          className="mx-auto"
          alt="Fuxam Logo"
        />
        <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <p className="text-base font-semibold leading-8 text-fuxam-pink">
            500
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-offwhite-2">
            An unexpected error happened
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8 dark:text-offwhite-5">
            Sorry for that, we are working tirelessly to improve our product.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul
            role="list"
            className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5 dark:divide-offblack-5 dark:border-offblack-5"
          >
            {links.map((link, linkIdx) => {
              if (!link.isDifferent)
                return (
                  <li key={linkIdx} className="relative flex gap-x-6 py-6 ">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10 dark:ring-offblack-5">
                      <link.icon
                        className="h-5 w-5 text-fuxam-pink"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-auto">
                      <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-offwhite-2">
                        <a href={link.href}>
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          {link.name}
                        </a>
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-offwhite-5">
                        {link.description}
                      </p>
                    </div>
                    <div className="flex-none self-center">
                      <ChevronRight
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </li>
                );
              else
                return (
                  <li
                    key={linkIdx}
                    className="relative flex gap-x-6 py-6 "
                    onClick={() => {
                      toast.warning(
                        "toast.content_block_warning_in_development",
                        {
                          icon: "🚧",
                          description:
                            "toast.content_block_warning_in_development_description",
                        },
                      );
                    }}
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10 dark:ring-offblack-5">
                      <link.icon
                        className="h-5 w-5 text-fuxam-pink"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-auto">
                      <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-offwhite-2">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {link.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-offwhite-5">
                        {link.description}
                      </p>
                    </div>
                    <span
                      className={
                        "my-auto ml-1 inline-flex h-[30px] items-center rounded-full bg-yellow-100 px-2 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }
                    >
                      Soon
                    </span>
                  </li>
                );
            })}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="text-sm font-semibold leading-6 text-fuxam-pink hover:text-fuxam-pink/80"
            >
              <span aria-hidden="true" className="mr-1">
                &larr;
              </span>
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
