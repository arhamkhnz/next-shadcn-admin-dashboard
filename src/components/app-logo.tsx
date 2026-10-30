import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="62 62 376 376"
      width={500}
      height={500}
      fill="currentColor"
      fillRule="evenodd"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M250.00 96.71L305.29 192.49L287.84 226.77L300.56 248.81L272.06 278.29L280.78 293.40L320.56 283.45L333.29 305.49L371.71 307.51L427.00 403.29L316.41 403.29L295.45 371.03L270.00 371.03L258.72 331.60L241.28 331.60L230.00 371.03L204.55 371.03L183.59 403.29L73.00 403.29L128.29 307.51L166.71 305.49L179.44 283.45L219.22 293.40L227.94 278.29L199.44 248.81L212.16 226.77L194.71 192.49Z" />
    </svg>
  );
}
