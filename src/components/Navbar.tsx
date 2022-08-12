import React from 'react';
import './Navbar.css';

export function Navbar() {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
    },
  };

  return (
    <div id="topnav" style={styles.container}>
      <a>./fzn (early release)</a>
      <div id="topnav-right">
        <button id="visibility" type="button" className="button">Show archived</button>
        <button id="friends" type="button" className="button">Friends</button>
        <button id="help" type="button" className="button">Help</button>
        <button id="logout" type="button" className="button">Logout</button>
      </div>
    </div>
  );
}
