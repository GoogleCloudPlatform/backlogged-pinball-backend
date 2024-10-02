import Link from "next/link";
import Image from 'next/image'
import QRCodeLink from "@/app/components/qr-code-link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <QRCodeLink url="https://goo.gle/backlogged" />
      <div className="mt-8 mb-32 grid text-center md:max-w-5xl md:w-full md:mb-0 grid-cols-2 md:grid-cols-4 md:text-left">
        <Link
          href="/stats"
          className="group rounded-lg border border-2 border-black px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 bg-white m-2"
        >
          <h2 className={`md:mb-3 md:text-xl font-semibold`}>
            Stats
          </h2>
          <p className={`hidden md:block m-0 max-w-[30ch] text-sm opacity-50`}>
            See Player Stats
          </p>
        </Link>

        <Link
          href="/events"
          className="group rounded-lg border border-2 border-black px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 bg-white m-2"
        >
          <h2 className={`md:mb-3 md:text-xl font-semibold`}>
            Event Stream
          </h2>
          <p className={`hidden md:block m-0 max-w-[30ch] text-sm opacity-50`}>
            View the live events as they happen on the pinball machine.
          </p>
        </Link>

        <Link
          href="/analysis"
          className="group rounded-lg border border-2 border-black px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 bg-white m-2"
        >
          <h2 className={`md:mb-3 md:text-xl font-semibold`}>
            Analysis
          </h2>
          <p className={`hidden md:block m-0 max-w-[30ch] text-sm opacity-50`}>
           See the latest game analysis as it happens!
          </p>
        </Link>

        <Link
          href="/about"
          className="group rounded-lg border border-2 border-black px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 bg-white m-2"
        >
          <h2 className={`md:mb-3 md:text-xl font-semibold`}>
            About
          </h2>
          <p className={`hidden md:block m-0 max-w-[30ch] text-sm opacity-50`}>
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
          className="fixed -z-30 -bottom-12 motion-safe:animate-jump"
          src="/backlogged-beaver.png"
          width={500}
          height={500}
          alt="Cartoon beaver holding a keyboard"
        />
        <Image
          className="fixed -z-50 bottom-0 md:-bottom-96"
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
