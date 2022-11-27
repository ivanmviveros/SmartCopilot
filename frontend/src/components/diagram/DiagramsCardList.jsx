import * as DiagramService from "../../service/DiagramService"
import React, { useState } from 'react';
import { useEffect } from "react";
import { API_URL } from "../../utils";
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Toast, Modal } from "bootstrap";
import { options } from '@bpmn-io/properties-panel/preact';
import * as ProjectService from "../../service/ProjectService";

// Components
import DiagramCard from "./DiagramCard";
import NavBar from "../NavBar";
import ModalDiagram from "./ModalDiagram";
import Alert from '../Alert';
import ModalPdf from '../pdfbacklog/ModalPdf';
import Pagination from "../Pagination";
import Footer from "../Footer";

function DiagramsCardList() {
    const { projectId } = useParams();
    let navigate = useNavigate();
    const [diagrams, setDiagrams] = useState([{}])
    const [project, setProject] = useState({})
    const [newDiagram, setNewDiagram] = useState({
        name: '',
        description: '',
    })
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [refAlertElement] = useState(React.createRef());
    const [modalPdf, setModalPdf] = useState('');
    const [refModalPdf] = useState(React.createRef());
    const [loadDiagrams, setLoadDiagrams] = useState(false);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [diagramsPerPage] = useState(40);
    // Get current diagrams
    const indexOfLastDiagram = currentPage * diagramsPerPage;
    const indexOfFirstDiagram = indexOfLastDiagram - diagramsPerPage;
    const currentDiagrams = diagrams.slice(indexOfFirstDiagram, indexOfLastDiagram);

    const getListDiagrams = () => {
        setLoadDiagrams(false)
        try {
            DiagramService.listDiagram(projectId).then(res => {
                setDiagrams(res.data)
                setLoadDiagrams(true)
            })
        } catch (error) {
            // console.log(error)
        }
    }

    const getProject = () => {
        try {
            ProjectService.getProject(projectId).then(res => {
                setProject(res.data)
            })
        } catch (error) {
            // console.log(error);
        }
    }

    const createNewDiagram = async (e) => {
        e.preventDefault();
        try {
            const xml = await fetch(`${API_URL}/static/xml/base-diagram.bpmn.xml`)
                .then(response => response.text());
            const svg = await fetch(`${API_URL}/static/svg/base-diagram.svg`)
                .then(response => response.text());

            const formData = {
                name: newDiagram.name,
                description: newDiagram.description,
                xml: xml,
                svg: svg,
                json_user_histories: {},
                id_project: projectId,
            }
            const diagram = await DiagramService.createDiagram(formData);
            navigate(`/project/${projectId}/diagram/${diagram.id}`);
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

    const jsonCreate = () => {
        var newId = 1
        let arrUserStories = []
        console.log(diagrams);
        diagrams.forEach((element, i) => {
            if (element.json_user_histories?.userStories) {
                element.json_user_histories.userStories.map(us => {
                    us.id = 'US-' + newId
                    newId++
                    return us
                })
                arrUserStories = arrUserStories.concat(element.json_user_histories.userStories)
            }
        });


        return {
            projectId: projectId,
            userStories: arrUserStories
        }
    }

    const openModalPdf = async () => {
        const modal = new Modal(refModalPdf.current, options);
        modal.show();
        setModalPdf(modal);
    }

    const getScrollBarWidth = () => {
        const scrollBarWidth = window.innerWidth - document.documentElement.getBoundingClientRect().width;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`)
    }

    useEffect(() => {
        setTimeout(() => {
            getScrollBarWidth()
        }, 200)
    }, [diagrams]);

    useEffect(() => {
        getListDiagrams()
        getProject()

        window.onresize = () => {
            getScrollBarWidth()
        }
    }, [])

    return (
        <div className="bg-two">
            <NavBar />

            <div className="content p-4">
                <div className="mb-4 text-center">
                    <p className="fs-20">Do you want create something?</p>
                    <button className="btn-one py-2" data-bs-toggle="modal" data-bs-target="#modalDiagram">
                        <i className="bi bi-plus-lg"></i> New Diagram
                    </button>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3 px-3 w-100">
                    <div>
                        <h5 className="fs-6 mb-0">Project</h5>
                        <h3 className="fw-semibold mb-0">{project.name}</h3>
                    </div>
                    <button className="btn-one py-2" onClick={() => openModalPdf()}>
                        <i className="bi bi-file-earmark-plus"></i> Create User Stories
                    </button>
                </div>

                <div className="d-flex justify-content-center">
                    {
                        loadDiagrams ?
                            <div>
                                <div className="d-flex flex-wrap mb-5">
                                    {
                                        diagrams.length > 0 ?
                                            (
                                                currentDiagrams.map(
                                                    (element, i) =>
                                                        <DiagramCard key={i} index={i} diagram={element} getListDiagrams={getListDiagrams} showAlert={showAlert} projectId={projectId} />
                                                )
                                            )
                                            :
                                            <div className="cont-card-diagrams">
                                                <div className="card-diagrams bg-three d-flex justify-content-center align-items-center rounded shadow-lg border-dashed m-3">
                                                    <div className="d-flex flex-wrap text-center">
                                                        <i className="bi bi-slash-circle fs-3 w-100"></i>
                                                        <span className="w-100">Empty</span>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </div>
                                <Pagination elementsPerPage={diagramsPerPage} totalElements={diagrams.length} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
                            </div>
                            :
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                    }
                </div>

                <ModalDiagram mode='Create' handle={handleChange} createNewDiagram={createNewDiagram} />
                <ModalPdf jsonCreate={jsonCreate} modalPdf={modalPdf} refModalPdf={refModalPdf}></ModalPdf>
                <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
            </div>

            <Footer></Footer>
        </div>
    )
}
export default DiagramsCardList;