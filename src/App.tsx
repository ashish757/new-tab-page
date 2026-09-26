import './App.css'
import SearchBar from "./searchBar/SearchBar.tsx";
import CardContainer from "./codingCards/CardContainer.tsx"

function App() {

  return (
    <main>
       <SearchBar />
        <div className={"Cards"}>
            <CardContainer />
        </div>
    </main>
  )
}

export default App
