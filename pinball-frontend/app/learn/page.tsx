
import Image from 'next/image'
export default function Learn() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Learn how to use the Google Cloud products used in this project.

      <Image
        src="gke-diagram.png"
        alt="Architecture Diagram"
      />
      <Image src="blog-qr.png"
      alt="Link to blog post" />
    </main >
  );
}
