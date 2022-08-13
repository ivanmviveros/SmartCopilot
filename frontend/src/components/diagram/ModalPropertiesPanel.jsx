import { useState, useEffect } from 'react';
import { is } from 'bpmn-js/lib/util/ModelUtil';

function ModalPropertiesPanel(props) {
    const [userHistory, setUserHistory] = useState({
        'uh:name': '',
        'uh:title': '',
        'uh:description': '',
        'uh:priority': '',
        'uh:estimatedTime': '',
        'uh:dependencies': '',
    });

    const updateLabel = (e) => {
        const { name, value } = e.target;
        const modeling = props.modeler.get('modeling');

        modeling.updateLabel(props.selectedElement, value);
        setUserHistory((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const updateProperties = (e) => {
        const { name, value } = e.target;
        const modeling = props.modeler.get('modeling');

        modeling.updateProperties(props.selectedElement, {
            [name]: value
        });
        setUserHistory((prevState) => ({
            ...prevState,
            [name]: value
        }))

        console.log(props.selectedElement.businessObject.get('uh:description'))
    }

    const createProperties = (element, type) => {
        const properties = {};
        const propertiesElement = element.businessObject.$model.getTypeDescriptor(type).properties;

        properties['uh:name'] = element.businessObject.name || '';
        for (let i = 0; i < propertiesElement.length; i++) {
            properties[propertiesElement[i].name] = element.businessObject.get(propertiesElement[i].name) || '';
        };

        return properties;
    }

    const createDependeces = () => {
        const incoming = props.selectedElement.incoming;

        console.log(props.selectedElement)
    }

    useEffect(() => {
        if (props.selectedElement !== '') {
            createDependeces()
            setUserHistory(createProperties(props.selectedElement, props.typeElement));
        }
    }, [props.selectedElement]);

    return (
        <div className="modal fade" id="propertiesPanel" aria-labelledby="tittlePropertiesPanel" aria-hidden="true" ref={props.refModalPropertiesElement}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="tittlePropertiesPanel">Properties Panel</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {
                            is(props.selectedElement, props.typeElement) &&
                            <div>
                                <div className="mb-3">
                                    <label className="form-label">Name:</label>
                                    <input className="form-control" name='uh:name' value={userHistory['uh:name']} onChange={updateLabel} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Estimated Time:</label>
                                    <input className="form-control" name='uh:estimatedTime' value={userHistory['uh:estimatedTime']} onChange={updateProperties} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Priority:</label>
                                    <input className="form-control" name='uh:priority' value={userHistory['uh:priority']} onChange={updateProperties} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Dependencies:</label>
                                    <p></p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description:</label>
                                    <textarea className="form-control" rows="5" name='uh:description' value={userHistory['uh:description']} onChange={updateProperties}></textarea>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ModalPropertiesPanel;