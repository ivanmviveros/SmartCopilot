import * as ProjectService from "../../service/ProjectService"
import React, { useState } from 'react';
import { useEffect } from "react";
import { Toast } from "bootstrap";

// Components
import NavBar from "../NavBar";
import Project from "./Project";
import ModalProject from "./ModalProject";
import Alert from "../Alert";

function ProjectsList() {
    const [projects, setProjects] = useState([{}])
    const userId = sessionStorage.getItem('userId')
    const [newProject, setNewProject] = useState({
        name: '',
        user_id: '',
    })
    const [indexDeleteProject, setIndexDeleteProject] = useState(-1);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [refAlertElement] = useState(React.createRef());

    const getListProjects = async () => {
        try {
            const res = await ProjectService.listProject(userId)
            setProjects(res.data)
        } catch (error) {
            // console.log(error)
        }
    }

    const createNewProject = async () => {
        try {
            const formData = {
                name: newProject.name,
                user_id: userId
            }
            await ProjectService.createProject(formData);
            getListProjects()
        } catch (error) {
            // console.log(error);
        }
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setNewProject((prevState) => ({
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
        getListProjects()
    }, [])
    return (
        <>
            <NavBar />
            <div className="m-4 text-center">
                <h5>To get started, create a new project.</h5>
                <button onClick={() => setNewProject((prevState) => ({ ...prevState, 'name': '' }))} className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalProject">
                    <i className="bi bi-plus-lg"></i> New project!
                </button>
            </div>
            <hr></hr>
            <h3 className="text-center">My Projects</h3>
            <table className="table container">
                <thead>
                    <tr className="text-center">
                        <th>Id</th>
                        <th>Name</th>
                        <th>Last modification</th>
                        <th>Diagrams</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.length > 0 ?
                        (
                            projects.map(
                                (element, i) =>
                                    <Project key={i} index={i} project={element} getListProjects={getListProjects} showAlert={showAlert} />
                            )
                        )
                        : (
                            <tr>
                                <td className="fst-italic fw-lighte fs-5 text-center" colSpan={6}>There is nothing to show</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

            <ModalProject mode='Create' name={newProject.name} handle={handleChange} createNewProject={createNewProject} />
            <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
        </>

    )
}
export default ProjectsList;