import React, { useState } from 'react';
import diagrama from "../../assets/diagrama-de-flujo.png"
import * as DiagramService from "../../service/DiagramService"
import { Link } from 'react-router-dom';
import { Toast } from 'bootstrap';

//Components
import Alert from '../Alert';

function DiagramCard({ diagram, listDiagrams }) {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertElement] = useState(React.createRef());

    const handleDelete = async (diagramId) => {
        try {
            await DiagramService.deleteDiagram(diagramId)
            setAlertMessage('Eliminado exitosamente');
            const toast = new Toast(alertElement.current);
            toast.show();
            await listDiagrams()
        } catch (error) {
            setAlertMessage('Se produjo un error al eliminar');
            const toast = new Toast(alertElement.current);
            toast.show();
        }
    }

    return (
        <>
            <div className="m-2 card card_diagram">
                <img src={diagrama} className="card-img-top" alt="Diagram" />
                <div className="card-body">
                    <h5 className="card-title truncated_text">{diagram.name}</h5>
                    <p className="card-text truncated_text">{diagram.description}</p>
                    <div className="row">
                        <hr />
                        <div className="col-sm-6 mx-3">
                            <div className="row">
                                <Link className="btn btn-primary" to={`/diagram/design/${diagram.id}`}>Open</Link>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <button className="btn btn-danger fw-bold" data-bs-toggle="modal" data-bs-target={`#diagram${diagram.id}`}>
                                X
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal delete*/}
            <div className="modal fade" id={`diagram${diagram.id}`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Diagram</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure to delete {diagram.name}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button id="deleteDiagramButton" data-bs-dismiss="modal" onClick={() => diagram.id && handleDelete(diagram.id)} type="button" className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal-end */}
            <Alert message={alertMessage} alertElement={alertElement} />
        </>
    )
}
export default DiagramCard;