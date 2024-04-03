'use client'

import QRCode from "react-qr-code";

export default function QRCodeLink({url=window.location.href}: {url?: string}) {
  const size=200;
  return (
    <div className={`fixed bottom-4 right-4 h-[${size}px] w-[${size}px]`}>
      <QRCode value={url} size={size} />
    </div>
  );
}
