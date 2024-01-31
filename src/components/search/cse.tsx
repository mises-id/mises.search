// cse.tsx
import React, { useEffect } from 'react';

interface Props {
  cx: string;
}

const GoogleCustomSearch: React.FC<Props> = ({ cx }) => {
  useEffect(() => {
    // google cse script 
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=${cx}`;
    script.async = true;
    document.body.appendChild(script);

    // cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, [cx]);

  // google cse container
  return <div className="gcse-search"></div>;
};

export default GoogleCustomSearch;
