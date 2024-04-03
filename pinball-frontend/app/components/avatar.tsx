'use client'

import { memo } from "react";
import Image from 'next/image'

export default memo(function Avatar({ avatar }: { avatar: string }) {
  return <>
    <Image
      src={`/avatars/${avatar}.png`}
      width={50}
      height={50}
      alt="animal avatar"
    />
  </>;
});
