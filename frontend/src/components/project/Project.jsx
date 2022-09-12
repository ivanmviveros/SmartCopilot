import * as ProjectService from "../../service/ProjectService"
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

function Project({ project, listProjects }) {
    const [newProject, setNewProject] = useState({
        name: '',
    })

    const handleDelete = async (projectId) => {
        try {
            await ProjectService.deleteProject(projectId)
            await listProjects()
        } catch (error) {
            console.log(error)
        }
    }

    const updateProject = async (projectId) => {
        try {
            const formData = {
                name: newProject.name,
            }
            await ProjectService.updateProject(formData,projectId)
            await listProjects()
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setNewProject((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }
    return (
        <>

            <tr>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.update_date}</td>
                <td>
                    <Link className="btn btn-primary" to={`/diagrams/${project.id}`}><i className="bi bi-eye"></i></Link>
                </td>
                <td>
                    <button className="btn btn-success fw-bold" data-bs-toggle="modal" data-bs-target={`#projectUpdate${project.id}`}>
                    <i className="bi bi-pencil-square"></i>
                    </button>
                </td>
                <td>
                    <button className="btn btn-danger fw-bold" data-bs-toggle="modal" data-bs-target={`#project${project.id}`}>
                    <i className="bi bi-folder-x"></i>
                    </button>
                </td>
              


            </tr>

            {/* Modal delete*/}
            <div className="modal fade" id={`project${project.id}`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title  text-dark" id="exampleModalLabel">Delete Project</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-start">
                            Are you sure to delete {project.name}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button id="deleteProjectButton" data-bs-dismiss="modal" onClick={() => project.id && handleDelete(project.id)} type="button" className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal-end */}


            {/* Modal update*/}
            <div className="modal fade" id={`projectUpdate${project.id}`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title  text-dark" id="exampleModalLabel">UpdateProject</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-start">
                            Are you sure to update {project.name}?
                            <input className="form-control" name='name'  onChange={handleChange} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button id="deleteProjectButton" data-bs-dismiss="modal" onClick={() => project.id && updateProject(project.id)} type="button" className="btn btn-success">Update</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal update */}
        </>
    )
}
export default Project;