import { useState, useEffect } from 'react';
import { is } from 'bpmn-js/lib/util/ModelUtil';

// Components
import ListRecommendations from './ListRecommendations';

function ModalPropertiesPanel(props) {
    let arrDependencies = []
    const [tasks, setTasks] = useState([]);
    const [panelRecommendations, setPanelRecommendations] = useState(false);
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

    }

    const createProperties = (element, type) => {
        const properties = {};
        const propertiesElement = element.businessObject.$model.getTypeDescriptor(type).properties;

        properties['uh:name'] = element.businessObject.name || '';
        properties['uh:dependencies'] = "";
        for (let i = 0; i < propertiesElement.length; i++) {
            properties[propertiesElement[i].name] = element.businessObject.get(propertiesElement[i].name) || '';
        };

        return properties;
    }

    const createDependeces = () => {
        const modeling = props.modeler.get('modeling');
        iterElement(props.selectedElement)
        modeling.updateProperties(props.selectedElement, {
            'uh:dependencies': arrDependencies
        });
        setUserHistory((prevState) => ({
            ...prevState,
            'uh:dependencies': arrDependencies
        }))
    }

    const iterElement = (actualElement) => {
        actualElement.incoming.forEach(element => {
            if (is(element.source, 'bpmn:Task')) {
                arrDependencies.push(element.source.businessObject.name)
            } else {
                iterElement(element.source)
            }
        });
    }

    const openListRecommendations = () => {
        setPanelRecommendations(!panelRecommendations);
    }

    const createElement = (parent, name) => {
        const modeler = props.modeler,
            elementFactory = modeler.get('elementFactory'),
            elementRegistry = modeler.get('elementRegistry'),
            modeling = modeler.get('modeling'),
            process = elementRegistry.get('Process_1'),
            startEvent = elementRegistry.get(parent.id),
            task = elementFactory.createShape({ type: 'bpmn:Task' });

        task.businessObject.name = name;
        modeling.createShape(task, { x: (parent.x + parent.width) + 140, y: parent.y + 40 }, process);
        modeling.connect(startEvent, task);

        return task;
    }

    const addElements = () => {
        var parent = props.selectedElement

        for (let i = 1; i < tasks.length; i++) {
            const newTask = createElement(parent, tasks[i]);

            parent = newTask;
        }
    }

    useEffect(() => {
        if (props.selectedElement !== '' && props.modalPropertiesPanel._isShown === true) {
            setTasks([props.selectedElement.businessObject.name]);
            setPanelRecommendations(false);
            setUserHistory(createProperties(props.selectedElement, props.typeElement));
            createDependeces();
        }
    }, [props.modalPropertiesPanel]);

    return (
        <div className="modal fade" id="propertiesPanel" aria-labelledby="tittlePropertiesPanel" aria-hidden="true" ref={props.refModalPropertiesElement}>
            <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${panelRecommendations ? 'w_with_recom' : 'w_without_recom'}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="tittlePropertiesPanel">Properties Panel</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-0 d-flex">
                        <div className={`p-3 ${panelRecommendations ? 'w-50' : 'w-100'}`}>
                            <div className="mb-3">
                                <label className="form-label">Name:</label>
                                <div className='d-flex'>
                                    <input className="form-control" name='uh:name' value={userHistory['uh:name']} onChange={updateLabel} />
                                    <button className='btn btn-primary ms-3 d-flex' onClick={() => openListRecommendations()}>
                                        <i className="bi bi-lightbulb-fill me-1"></i>
                                        <i className={`bi ${panelRecommendations ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                                    </button>
                                </div>
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
                                {
                                    userHistory['uh:dependencies'].length > 0 ?
                                        (
                                            <div className="div">
                                                <label className="form-label">Dependencies:</label>
                                                <ul>
                                                    {userHistory['uh:dependencies'].map(
                                                        (element, i) =>
                                                            <li key={i}>{element}</li>
                                                    )}
                                                </ul>
                                            </div>
                                        ) : ""
                                }

                            </div>
                            <div>
                                <label className="form-label">Description:</label>
                                <textarea className="form-control" rows="5" name='uh:description' value={userHistory['uh:description']} onChange={updateProperties}></textarea>
                            </div>
                        </div>
                        {
                            panelRecommendations ?
                                <ListRecommendations tasks={tasks} setTasks={setTasks} selectedElement={props.selectedElement} modeler={props.modeler} userHistory={userHistory}></ListRecommendations>
                                : ''
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => addElements()}>Done</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ModalPropertiesPanel;