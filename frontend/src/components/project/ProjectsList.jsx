import * as ProjectService from "../../service/ProjectService"
import React, { useState } from 'react';
import { useEffect } from "react";


// Components
import NavBar from "../NavBar";
import Project from "./Project";
import ModalProject from "./ModalProject";



function ProjectsList() {
    const [data, setData] = useState([{}])
    const userId = sessionStorage.getItem('userId')
    const [newProject, setNewProject] = useState({
        name: '',
        user_id: '',
    })

    const getData = async () => {
        try {
            const res = await ProjectService.listProject(userId)
            setData(res.data)
            // console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const createNewProject = async () => {
        try {
            const formData = {
                name: newProject.name,
                user_id: userId
            }
            const project = await ProjectService.createProject(formData);
            getData()
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

    useEffect(() => {
        getData()
        console.log(data)
    }, [])
    return (
        <>
            <NavBar />
            <div className="m-4 text-center">
                <h5>
                    To get started, create a new project.</h5>
                <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalProject">
                    <i className="bi bi-plus-lg"></i> New project!
                </button>
            </div>
            <hr></hr>
            <h3 className="text-center">My Projects</h3>
            <table className="table container ">
                <thead>
                    <tr className="text-center">
                        <th>id</th>
                        <th>Name</th>
                        <th>Last modification</th>
                        <th>Diagrams</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody className="text-center">

                    {data.length > 0 ?
                    (
                        data.map(
                            (element, i) =>
                                <Project key={i} project={element} listProjects={getData} />
                        ))
                    :(<h5 className="fst-italic fw-lighte">There is nothing to show</h5>)
                    }
                </tbody>
            </table>

            <ModalProject mode='Create' handle={handleChange} createNewProject={createNewProject} />
        </>

    )
}
export default ProjectsList;