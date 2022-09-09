import React, { useState, useEffect } from 'react';

function Alert(props) {
    const [backgroundColor, setBackgroundColor] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        if (props.type === 'Success') {
            setBackgroundColor('text-bg-success')
            setIcon('bi bi-check-circle')
        } else if (props.type === 'Error') {
            setBackgroundColor('text-bg-danger')
            setIcon('bi bi-x-circle')
        } else if (props.type === 'Warning') {
            setBackgroundColor('text-bg-warning')
            setIcon('bi bi-exclamation-triangle-fill')
        }
    }, [props.type]);

    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div className='toast align-items-center bg-white border-0' role="alert" aria-live="assertive" aria-atomic="true" ref={props.refAlertElement}>
                <div className={`toast-header ${backgroundColor}`}>
                    <i className={`me-1 ${icon}`}></i>
                    <strong className="me-auto">{props.type}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    {props.message}
                    {
                        props.type === 'Warning' ?
                            <div className="mt-2 pt-2 border-top">
                                <button type="button" className="btn btn-primary btn-sm" onClick={props.action}>Yes</button>
                                <button type="button" className="btn btn-secondary btn-sm ms-2" data-bs-dismiss="toast">No</button>
                            </div>
                            : ''
                    }
                </div>
            </div>
        </div>
    )
}
export default Alert;