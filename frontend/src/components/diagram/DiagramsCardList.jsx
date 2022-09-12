import * as DiagramService from "../../service/DiagramService"
import React, { useState } from 'react';
import { useEffect } from "react";
import { API_URL } from "../../utils";
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';

// Components
import DiagramCard from "./DiagramCard";
import NavBar from "../NavBar";
import ModalDiagram from "./ModalDiagram";

function DiagramsCardList() {
    const { projectId } = useParams();
    let navigate = useNavigate();
    const [data, setData] = useState([{}])
    // const userId = sessionStorage.getItem('userId')
    const [newDiagram, setNewDiagram] = useState({
        name: '',
        description: '',
        // user_id: '',
    })

    const getData = async () => {
        try {
            const res = await DiagramService.listDiagram(projectId)
            setData(res.data)
            console.log(data);
            // console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDiagram = async () => {
        return await fetch(`${API_URL}/static/xml/base-diagram.bpmn.xml`)
            .then(response => response.text())
    }

    const createNewDiagram = async () => {
        try {
            const xml = await fetchDiagram();

            const formData = {
                name: newDiagram.name,
                description: newDiagram.description,
                xml: xml,
                // user_id: userId,
                json_user_histories: {},
                id_project: projectId,
                
            }
            const diagram = await DiagramService.createDiagram(formData);
            console.log(diagram)
            navigate(`/diagram/design/${diagram.id}`);
        } catch (error) {
            // console.log(error);
        }
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setNewDiagram((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }
    // console.log(data)
    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <NavBar />
            <div className="m-4 text-center">
                <h5>Do you want create something?</h5>
                <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalDiagram">
                    <i className="bi bi-plus-lg"></i> Create New Diagram
                </button>
            </div>
            <div className="m-4 row">

                {data.length > 0 ?
                    (
                        data.map(
                            (element, i) =>
                                <DiagramCard key={i} diagram={element} listDiagrams={getData} />
                        ))

                    : (<h5 className="fst-italic fw-lighte">There is nothing to show</h5>)
                }
            </div>


            <ModalDiagram mode='Create' handle={handleChange} createNewDiagram={createNewDiagram} />
        </>
    )
}
export default DiagramsCardList;