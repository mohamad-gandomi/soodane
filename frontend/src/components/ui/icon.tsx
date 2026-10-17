import React from 'react';

export type IconName =
  | 'home'
  | 'special'
  | 'orders'
  | 'reward'
  | 'account'
  | 'cart'
  | 'bell'
  | 'back'
  | 'search'
  | 'filter'
  | 'pin'
  | 'trash'
  | 'share'
  | 'chevron'
  | 'check';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    ...props,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="m4 11 8-7 8 7v9H4z" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case 'special':
      return (
        <svg {...common}>
          <path d="m13 2-8 12h6l-1 8 9-13h-6z" />
        </svg>
      );
    case 'orders':
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="14" rx="2" />
          <path d="M8 6V4h8v2M8 11h8" />
        </svg>
      );
    case 'reward':
      return (
        <svg {...common}>
          <path d="M4 10h16v10H4zM3 6h18v4H3zM12 6v14" />
          <path d="M12 6H8.5a2.5 2.5 0 1 1 2.5-2.5" />
        </svg>
      );
    case 'account':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
        </svg>
      );
    case 'cart':
      return (
        <svg {...common}>
          <path d="M3 4h2l2 11h10l2-8H6.2" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="17" cy="20" r="1" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );
    case 'back':
      return (
        <svg {...common}>
          <path d="m9 5 7 7-7 7" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...common}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path d="M19 10c0 5-7 10-7 10s-7-5-7-10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 13h10l1-13" />
        </svg>
      );
    case 'share':
      return (
        <svg {...common}>
          <circle cx="18" cy="5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="19" r="2.5" />
          <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
        </svg>
      );
    case 'chevron':
      return (
        <svg {...common}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    default:
      return null;
  }
}
