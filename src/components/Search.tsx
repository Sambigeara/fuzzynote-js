import React, { useState } from 'react';
import './Search.css';

function SearchGroup(props: {text: string}) {
  return (
    <div className="searchgroup"
         contentEditable>
      {props.text}
    </div>
  );
}

export function Search() {
  //const [searchGroups, setSearchGroups] = useState([]); 
  const searchGroups = ["search group 1", "and another"]
  
  return (
    <div id="search">
      <div id="searchgroups">
        {searchGroups.map((s) =>
          <SearchGroup text={s}
                       key={s} />)
        }
      </div>
    </div>
  );
}
