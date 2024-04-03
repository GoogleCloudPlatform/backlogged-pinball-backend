import QRCodeLink from "@/app/components/qr-code-link";

export default function Learn() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QRCodeLink url="https://goo.gle/backlogged-learn" />
      Learn how to use the Google Cloud products used in this project.
    </main >
  );
}
