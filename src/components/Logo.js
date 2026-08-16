'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ size = 40, withText = true, className = '', src = '/logo2.png' }) {
  const imgHeight = withText ? size : Math.round(size * 0.88)
  const imgWidth = withText ? size : Math.round(size * 3.4)

  return (
    <Link href="/" className={`group flex shrink-0 items-center gap-2 ${className}`}>
      <div className="rounded-xl border border-white/60 bg-white/90 px-2 py-0.5 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
        <Image
          src={src}
          alt="Help Life Building"
          width={imgWidth}
          height={imgHeight}
          className="block object-contain"
          style={{ height: imgHeight, width: 'auto', maxWidth: imgWidth }}
          priority
        />
      </div>
      {withText && (
        <div className="hidden sm:block leading-tight">
          <p className="font-display text-lg font-bold tracking-tight text-slate-900">Help Life Building</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-600">Premium Learning</p>
        </div>
      )}
    </Link>
  )
}
