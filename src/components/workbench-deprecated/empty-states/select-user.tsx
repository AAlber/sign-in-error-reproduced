import Image from "next/image";

export default function SelectUser() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mb-10 text-center">
        <Image
          className="mx-auto mb-7 h-48 w-48"
          src="/illustrations/files.png"
          width={512}
          height={512}
          priority
          alt="Fuxam files"
        />
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-contrast">
          Let&apos;s start correcting!
        </h1>
        <p className="mt-1 text-base text-muted-contrast">
          Choose a user from the sidebar to begin reviewing their submitted
          tasks. If you don&apos;t
        </p>
        <p className="mt-1 text-base text-muted-contrast">
          see any tasks yet, encourage your users to start submitting.
        </p>
        <p className="mt-1 text-base text-muted-contrast">
          You can also switch from user-based-review to task-based-review by
        </p>
        <p className="mt-1 text-base text-muted-contrast">
          clicking using the navigator on the far left of the screen.
        </p>
      </div>
    </div>
  );
}
