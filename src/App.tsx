import React, {useState} from 'react';
import './App.scss';
import Select from "./components/select/Select";


const options = [
  { name: "Firstdsfsdfsdfsdfsdfsdfsdfsddfsdfdfsageghfghgwdf", _id: 1},
  { name: "Second", _id: 2},
  { name: "Third", _id: 3},
  { name: "Fourth", _id: 4},
  { name: "Fifth", _id: 5}
]

function App() {

  const [value1, setValue1] = useState<{ name: string, _id: number } | undefined>(undefined)
  const [value2, setValue2] = useState<{ name: string, _id: number }[]>([])

  return (
    <div className="App">
      <div className="container">
        <Select multiple={true} options={options} selected={value2} onChange={setValue2} />
        <Select multiple={false} options={options} selected={value1} onChange={setValue1} />
      </div>
    </div>
  );
}

export default App;
