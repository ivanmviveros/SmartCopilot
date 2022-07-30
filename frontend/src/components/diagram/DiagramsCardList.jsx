import * as DiagramService from "../../service/DiagramService"
import React, { useState } from 'react';
import { useEffect } from "react";
import DiagramCard from "./DiagramCard";
import NavBar from "../NavBar";

function DiagramsCardList(){
const [data, setData] = useState([{}])

const getData = async () => {
    try {
       const res =  await DiagramService.listDiagram()
       const data = await res.json()
       setData(data.data)
       console.log(data)
    }catch(error){
        console.log(error)
    }
}
// console.log(data)
useEffect(() => {
    getData()
},[])

return (

<>
    <NavBar />
    <div className="m-4 text-center">
        <h5>Do you want create something?</h5>
        <button className="btn btn-success">+ Create New Diagram</button>
    </div>
    <div className="m-4">

        {data.length>0?
        (
            data.map(
                 element => 
                 <DiagramCard key={element.id} diagram={element} listDiagrams={getData}/>
            ))
            
            :(<h5 className="fst-italic fw-lighte">There is nothing to show</h5>)
        }
    </div>
 </>
)
}
export default DiagramsCardList;