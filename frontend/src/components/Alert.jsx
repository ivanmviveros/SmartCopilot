import React from 'react';

function Alert(props) {
    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" ref={props.refAlertElement}>
                <div className="d-flex">
                    <div className="toast-body">
                        {props.message}
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    )
}
export default Alert;