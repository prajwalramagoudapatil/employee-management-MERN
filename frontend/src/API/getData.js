import { useState, useEffect } from "react"; 
 
export default function getData() { 
  
  var data = {};
    fetch(`http://localhost:8000/`) 
      .then((response) => response.json()) 
      .then((jsonData) => {
         console.log('data fetch successful');
         console.log(jsonData);
         return (jsonData);
       }) 
      .catch((error) => {
        console.log(error)
        data['error'] = error;
      }); 
  return data;
}

function GetData() { 
  const [data, setData] = useState({})
  useEffect(() => { 
    fetch(`http://localhost:8000/`) 
      .then((response) => response.json()) 
      .then((jsonData) => {
         console.log('data fetch successful');
         setData(jsonData);
         console.log(data);
        }) 
      .catch((error) => console.log(error)); 
  }, []); 

  return data;
 
  // return ( 
  //   <> 
  //     <h1>Data in json format</h1> 
  //     { Object.keys(data).map((key) => (
  //       <p key={key}>
  //         id: { data[key]['_id'] } <t/><t/><t/>
  //         published: { data[key]['published']}
  //       </p>
  //     )) }
  //   </> 
  // ); 
} 

export {
  GetData
}