import logo from './logo.svg';
import './App.css';
import { useQuery, gql } from "@apollo/client";
import { useEffect } from 'react';

const GET_DATA = gql`
  query Query {
    message
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_DATA);

  useEffect(() => {
    console.log('useeffect', data)
  }, [data])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
