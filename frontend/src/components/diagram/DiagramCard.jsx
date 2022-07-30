import diagrama from "../../assets/diagrama-de-flujo.png"
import * as DiagramService from "../../service/DiagramService"

function DiagramCard({ diagram, listDiagrams }) {
    const style = {
        width: '12rem',
        // height: '14rem'
    }

    const handleDelete = async (diagramId) => {
        await DiagramService.deleteDiagram(diagramId)
        listDiagrams()
    }


    return (
        <div className="card" style={style}>
            <img src={diagrama} className="card-img-top" alt="Diagram" />
            <div className="card-body">
                <h5 className="card-title">{diagram.name}</h5>
                <p className="card-text">{diagram.description}</p>
                <div className="row">
                    <hr />
                    <div className="col-sm-6 mx-3">
                        <div className="row">
                            <button className="btn btn-primary">Open</button>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-danger fw-bold" data-bs-toggle="modal" data-bs-target="#confirmDelete">
                            X
                        </button>

                        {/* Modal delete*/}
                        <div className="modal fade" id="confirmDelete" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DiagramCard;