import { Layers } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return <Layers className="h-6 w-6 text-primary" {...props} />;
}
