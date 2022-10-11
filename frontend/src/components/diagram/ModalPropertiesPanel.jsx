import { useState, useEffect } from 'react';
import { is } from 'bpmn-js/lib/util/ModelUtil';

// Components
import ListRecommendations from './ListRecommendations';

function ModalPropertiesPanel(props) {
    const [tasks, setTasks] = useState([]);
    const [panelRecommendations, setPanelRecommendations] = useState(false);
    const [contentPriority] = useState(['Low', 'Medium', 'High']);
    const [contentPoints] = useState([1, 2, 3, 5, 8, 13, 21]);
    const [userHistory, setUserHistory] = useState({
        'uh:name': '',
        'uh:priority': '',
        'uh:points': '',
        'uh:purpose': '',
        'uh:restrictions': '',
        'uh:acceptanceCriteria': '',
        'uh:dependencies': [],
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

        for (let i = 0; i < propertiesElement.length; i++) {
            properties[propertiesElement[i].name] = element.businessObject.get(propertiesElement[i].name) || '';
        };
        properties['uh:name'] = element.businessObject.name || '';
        properties['uh:dependencies'] = [];

        return properties;
    }

    const addDependencies = () => {
        setUserHistory((prevState) => ({
            ...prevState,
            'uh:dependencies': props.createDependencies(props.selectedElement)
        }))
    }

    const openListRecommendations = () => {
        setPanelRecommendations(!panelRecommendations);
    }

    const createElement = (parent, name) => {
        const modeler = props.modeler,
            elementFactory = modeler.get('elementFactory'),
            elementRegistry = modeler.get('elementRegistry'),
            modeling = modeler.get('modeling'),
            process = elementRegistry.get(parent.parent.id),
            startEvent = elementRegistry.get(parent.id),
            task = elementFactory.createShape({ type: 'bpmn:Task' });

        task.businessObject.name = name;
        modeling.createShape(task, { x: (parent.x + parent.width) + 140, y: parent.y + 40 }, process);
        modeling.connect(startEvent, task);
        initializeTask(task);

        return task;
    }

    const addElements = () => {
        var parent = props.selectedElement

        for (let i = 1; i < tasks.length; i++) {
            const newTask = createElement(parent, tasks[i]);

            parent = newTask;
        }
    }

    const initializeTask = (element) => {
        const modeling = props.modeler.get('modeling');
        const elementRegistry = props.modeler.get('elementRegistry');
        const arrElements = elementRegistry.filter(element => is(element, 'bpmn:Task'));

        modeling.updateProperties(element, {
            'id': 'US-' + arrElements.length,
            'uh:priority': contentPriority[0],
            'uh:points': contentPoints[0]
        })

        props.createTagUH(props.modeler, 'Create Task')
    }

    useEffect(() => {
        if (props.modeler !== '' && props.newTask !== '') {
            initializeTask(props.newTask)
        }
    }, [props.newTask]);

    useEffect(() => {
        if (props.selectedElement !== '' && props.modalPropertiesPanel._isShown === true) {
            setTasks([props.selectedElement.businessObject.name]);
            setPanelRecommendations(false);
            setUserHistory(createProperties(props.selectedElement, props.typeElement));
            addDependencies();
        }
    }, [props.modalPropertiesPanel]);

    return (
        <div className="modal fade" id="propertiesPanel" aria-labelledby="tittlePropertiesPanel" aria-hidden="true" ref={props.refModalPropertiesElement}>
            <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${panelRecommendations ? 'w_with_recom modal-xl' : 'w_without_recom modal-lg'}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="tittlePropertiesPanel">Properties Panel</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-0 d-flex">
                        <div className={`p-3 ${panelRecommendations ? 'w-50' : 'w-100'}`}>
                            <div className="pb-3">
                                <label className="form-label">Name:</label>
                                <div className='d-flex'>
                                    <input className="form-control" name='uh:name' value={userHistory['uh:name']} onChange={updateLabel} />
                                    <button className='btn btn-primary ms-3 d-flex' onClick={() => openListRecommendations()}>
                                        <i className="bi bi-lightbulb-fill me-1"></i>
                                        <i className={`bi ${panelRecommendations ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <div className='d-flex pb-3'>
                                <div className="w-50 me-2">
                                    <label className="form-label">Priority:</label>
                                    <select className="form-select" name='uh:priority' value={userHistory['uh:priority']} onChange={updateProperties}>
                                        {
                                            contentPriority.map((element, i) => <option key={i} value={`${element}`}>{element}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="w-50 ms-2">
                                    <label className="form-label">Points:</label>
                                    <select className="form-select" name='uh:points' value={userHistory['uh:points']} onChange={updateProperties}>
                                        {
                                            contentPoints.map((element, i) => <option key={i} value={`${element}`}>{element}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="pb-3">
                                <label className="form-label">Purpose:</label>
                                <textarea className="form-control" rows="3" name='uh:purpose' value={userHistory['uh:purpose']} onChange={updateProperties}></textarea>
                            </div>
                            <div className="pb-3">
                                <label className="form-label">Restrictions:</label>
                                <textarea className="form-control" rows="3" name='uh:restrictions' value={userHistory['uh:restrictions']} onChange={updateProperties}></textarea>
                            </div>
                            <div className="pb-3">
                                <label className="form-label">Acceptance Criteria:</label>
                                <textarea className="form-control" rows="3" name='uh:acceptanceCriteria' value={userHistory['uh:acceptanceCriteria']} onChange={updateProperties}></textarea>
                            </div>
                            {
                                userHistory['uh:dependencies'].length > 0 ?
                                    (
                                        <div className="pb-3">
                                            <label className="form-label">Dependencies:</label>
                                            <ul>
                                                {userHistory['uh:dependencies'].map(
                                                    (element, i) =>
                                                        <li key={i}>{element.name}</li>
                                                )}
                                            </ul>
                                        </div>
                                    ) : ""
                            }

                        </div>
                        {
                            panelRecommendations ?
                                <ListRecommendations tasks={tasks} setTasks={setTasks} selectedElement={props.selectedElement} modeler={props.modeler} userHistory={userHistory}></ListRecommendations>
                                : ''
                        }
                    </div>
                    <div className="modal-footer">
                        {
                            panelRecommendations ?
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => addElements()}>Done</button>
                                : ''
                        }
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalPropertiesPanel;