// components/TeamLogo/TeamLogo.web.tsx
import React from 'react';

interface TeamLogoProps {
  uri: string;
  style?: React.CSSProperties;
}

const TeamLogo = ({ uri, style }: TeamLogoProps) => {
  return (
    <img
      src={uri}
      alt="Team Logo"
      style={{ width: 40, height: 40, objectFit: 'contain', ...style }}
    />
  );
};

export default TeamLogo;
