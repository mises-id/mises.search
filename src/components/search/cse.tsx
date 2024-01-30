// cse.tsx
import React, { useEffect } from 'react';

interface Props {
  cx: string;
}

const GoogleCustomSearch: React.FC<Props> = ({ cx }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=${cx}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [cx]);

  return <div className="gcse-search"></div>;
};

export default GoogleCustomSearch;
