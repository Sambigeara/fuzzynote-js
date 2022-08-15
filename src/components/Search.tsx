import './Search.css';

function SearchGroup(props: {text: string}) {
  return (
    <div className="searchgroup">
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
        {searchGroups.map((s, i) =>
          <SearchGroup text={s}
                       key={i} />)
        }
      </div>
    </div>
  );
        //{searchGroups.map((s, i) => <div key={i} className="searchgroup">{s}</div>)}
}
