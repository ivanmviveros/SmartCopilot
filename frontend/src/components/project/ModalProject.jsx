import React from 'react';

function ModalProject(props) {
    return (
        <div className="modal fade" id="modalProject" aria-labelledby="tittleModalDiagram" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="tittleModalDiagram">{props.mode}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input className="form-control" name='name' value={props.name} onChange={props.handle} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        {props.mode === 'Create' ?
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.createNewProject}>Create</button> :
                            null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalProject;