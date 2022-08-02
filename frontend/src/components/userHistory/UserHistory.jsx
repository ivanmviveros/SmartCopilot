
function UserHistory({activate=true, title, description, priority, estimatedTime, dependencies}) {
    return (
        <div hidden={activate} className="card">
            <h5 className="card-header">{title}</h5>
            <div className="card-body">
                <h5 className="card-title">Description</h5>
                <p className="card-text">{description}</p>
                <div className="row">
                    <div className="col">
                     <small className="card-text fw-bold">Priority: {priority}</small>
                    </div>
                    <div className="col">
                        <small className="card-text fw-bold">Estimated(hrs): {estimatedTime}</small>
                    </div>
                    <div className="col">
                        <small className="card-text fw-bold">Dependencias: {dependencies}</small>
                    </div>
                </div>
                <a id="closeUserHistory" href="#"  className="btn btn-primary mt-3">close</a>
            </div>
        </div>
    )
}
export default UserHistory;