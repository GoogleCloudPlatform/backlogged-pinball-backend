import Link from "next/link";
import Image from 'next/image'
import QRCodeLink from "@/app/components/qr-code-link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QRCodeLink url="https://goo.gle/backlogged" />
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="/stats"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            Stats{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            See Player Stats
          </p>
        </Link>

        <Link
          href="/events"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            Event Stream{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            View the live events as they happen on the pinball machine.
          </p>
        </Link>

        <Link
          href="/learn"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn to use the Google Cloud products used in this project.
          </p>
        </Link>

        <Link
          href="/about"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-xl font-semibold`}>
            About{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            See how this project was built.
          </p>
        </Link>
      </div>
      <center className="fixed -z-10 top-0 w-screen h-screen overflow-clip">
        <div className="flex justify-center">
          <Image
            className="fixed -z-40 top-48 mx-auto motion-safe:animate-wiggle"
            src="/google-cloud-logo.png"
            width={500}
            height={500}
            alt="Google Cloud Logo"
          />
        </div>
        <div className="flex justify-center">
          <div className="fixed -z-40 top-60 mx-auto motion-safe:animate-wiggle">
            Backlogged Pinball
          </div>
        </div>
        <Image
          className="fixed -z-30 top-80 motion-safe:animate-jump"
          src="/backlogged-beaver.png"
          width={500}
          height={500}
          alt="Cartoon beaver holding a keyboard"
        />
        <Image
          className="fixed -z-50 top-80"
          src="/backlogged-background.png"
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={500}
          height={300}
          alt="Logs floating in the water"
        />
      </center>
    </main>
  );
}
