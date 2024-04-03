import QRCodeLink from "@/app/components/qr-code-link";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QRCodeLink url="https://pinball-frontend-ywmavwferq-wn.a.run.app/about" />
      See how this project was built.
    </main >
  );
}
