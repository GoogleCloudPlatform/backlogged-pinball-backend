'use client'

const twoDigitPad = (number: number) => {
  if (number < 10) {
    return ('0' + number);
  }
  return number.toString(); 
}

export default function MetricsTile({ title, value, color }: { title: string, value: number, color?: string }) {
  return (
    <div className="flex h-[5rem] mt-4">
      <div className={`flex flex-col justify-end w-8 ${color ? 'bg-gray-100' : ''}`}>
        {color && (
          <div className={`bg-red-500 w-full`} style={{ height: `${Math.max(value * 0.5, 0.5)}rem`, backgroundColor: color }} />
        )}
      </div>
      <div className="flex flex-col justify-end pl-2">
        <div className="font-bold">{title}</div>
        <div className="font-mono text-5xl">{twoDigitPad(value)}</div>
      </div>
    </div>
  );
}
