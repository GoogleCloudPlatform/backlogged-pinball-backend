'use client'

import { memo } from "react";
import Image from 'next/image'

export default memo(function Avatar({ avatar, size }: { avatar: string, size: number }) {
  return <>
    <Image
      src={`/avatars/${avatar}.png`}
      width={size}
      height={size}
      alt="animal avatar"
    />
  </>;
});
