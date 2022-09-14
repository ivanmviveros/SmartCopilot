import * as DiagramService from "../../service/DiagramService"
import React, { useState } from 'react';
import { useEffect } from "react";
import { API_URL } from "../../utils";
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Toast } from "bootstrap";

// Components
import DiagramCard from "./DiagramCard";
import NavBar from "../NavBar";
import ModalDiagram from "./ModalDiagram";
import Alert from '../Alert';

function DiagramsCardList() {
    const { projectId } = useParams();
    let navigate = useNavigate();
    const [diagrams, setDiagrams] = useState([{}])
    const [newDiagram, setNewDiagram] = useState({
        name: '',
        description: '',
    })
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [refAlertElement] = useState(React.createRef());

    const getListDiagrams = async () => {
        try {
            const res = await DiagramService.listDiagram(projectId)
            setDiagrams(res.data)
        } catch (error) {
            // console.log(error)
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
                json_user_histories: {},
                id_project: projectId,

            }
            const diagram = await DiagramService.createDiagram(formData);
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

    const showAlert = (type, message) => {
        setAlertMessage(message);
        setAlertType(type);
        const toast = new Toast(refAlertElement.current);
        toast.show();
    }

    useEffect(() => {
        getListDiagrams()
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
                {diagrams.length > 0 ?
                    (
                        diagrams.map(
                            (element, i) =>
                                <DiagramCard key={i} index={i} diagram={element} getListDiagrams={getListDiagrams} showAlert={showAlert} />
                        ))

                    : (<h5 className="fst-italic fw-lighte">There is nothing to show</h5>)
                }
            </div>

            <ModalDiagram mode='Create' handle={handleChange} createNewDiagram={createNewDiagram} />
            <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
        </>
    )
}
export default DiagramsCardList;