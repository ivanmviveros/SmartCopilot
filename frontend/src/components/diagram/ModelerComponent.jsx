import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDiagram as getInfoDiagram, updateDiagram } from '../../service/DiagramService';
import { Toast, Modal } from 'bootstrap';
import * as ProjectService from "../../service/ProjectService";

// BPMN
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import customRendererModule from '../../custom';
import uhExtension from '../../resources/userHistory';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import { options } from '@bpmn-io/properties-panel/preact';

// Components
import NavBar from '../NavBar';
import ModalDiagram from './ModalDiagram';
import Alert from '../Alert';
import ModalPropertiesPanel from './ModalPropertiesPanel';
import ModalUserStories from './ModalUserStories';

function ModelerComponent() {
  const HIGH_PRIORITY = 1500;
  const { diagramId, projectId } = useParams();
  const [instanceModeler, setInstanceModeler] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [refAlertElement] = useState(React.createRef());
  const [refModalPropertiesElement] = useState(React.createRef());
  const [modalPropertiesPanel, setModalPropertiesPanel] = useState('');
  const [refModalUserStories] = useState(React.createRef());
  const [modalUserStories, setModalUserStories] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [typeElement] = useState('uh:props');
  const [newTask, setNewTask] = useState('');
  const [project, setProject] = useState({})
  const [overlaysError, setOverlaysError] = useState([])
  const [diagram, setDiagram] = useState({
    name: '',
    description: '',
    xml: '',
  });

  async function run(bpmnModeler, xml) {
    try {
      await bpmnModeler.importXML(xml).then(() => {
        bpmnModeler.on('element.contextmenu', HIGH_PRIORITY, (e) => {
          e.originalEvent.preventDefault();
          e.originalEvent.stopPropagation();
          const element = e.element;

          if (is(element, 'uh:props')) {
            setSelectedElement(element);
            const modal = new Modal(refModalPropertiesElement.current, options);
            modal.show();
            setModalPropertiesPanel(modal);
          }
        });

        createTagUH(bpmnModeler, 'Initialize Tasks')
      })
    } catch (err) {
      // console.log(err);
    }
  }

  const createTagUH = (bpmnModeler, type) => {
    const modeling = bpmnModeler.get('modeling');
    const overlays = bpmnModeler.get('overlays');
    const elementRegistry = bpmnModeler.get('elementRegistry');
    const tasks = elementRegistry.filter(element => is(element, 'bpmn:Task'));

    // Reset id task
    if (type !== 'Create Task') {
      tasks.forEach((element, i) => {
        modeling.updateProperties(element, {
          'id': (i + 1)
        })
      })
    }

    // Assign id task
    tasks.forEach((element, i) => {
      modeling.updateProperties(element, {
        'id': 'SI-' + (i + 1),
      })
      overlays.add(element, {
        position: {
          top: -12,
          left: -5
        },
        html: `<div class="task-note">${element.businessObject.id}</div>`
      });
    })
  }

  const save = async (modeler) => {
    const elementRegistry = modeler.get('elementRegistry');
    const overlays = modeler.get('overlays');
    const participants = elementRegistry.filter(element => is(element, 'bpmn:Participant'));
    const tasks = elementRegistry.filter(element => is(element, 'bpmn:Task'));
    const invalidParticipants = [];
    const invalidTasks = [];
    var isValid = true;

    // Validate
    tasks.forEach(element => {
      if (element.businessObject.name === undefined || element.businessObject.name === null) {
        isValid = false;
        invalidTasks.push(element)
      }
    })
    participants.forEach(element => {
      if (element.businessObject.name === undefined || element.businessObject.name === null) {
        isValid = false;
        invalidParticipants.push(element)
      }
    })

    // Remove Notes
    overlaysError.forEach(element => {
      overlays.remove(element);
    })

    if (isValid) {
      try {
        const data = await modeler.saveXML({ format: true });
        const formData = {
          name: diagram.name,
          description: diagram.description,
          xml: data.xml,
          json_user_histories: jsonCreate(modeler),
        }
        await updateDiagram(formData, diagramId);
        // Alert
        setAlertMessage('Successfully saved');
        setAlertType('Success');
        const toast = new Toast(refAlertElement.current);
        toast.show();
      } catch (error) {
        // Alert
        setAlertMessage('Something wrong happened');
        setAlertType('Error');
        const toast = new Toast(refAlertElement.current);
        toast.show();
      }
    } else {
      // Alert
      setAlertMessage('Something wrong happened');
      setAlertType('Error');
      const toast = new Toast(refAlertElement.current);
      toast.show();
      // Create Note
      var overlayId, overlayIds = [];
      invalidParticipants.forEach(element => {
        overlayId = overlays.add(element, {
          position: {
            top: -12,
            left: -5
          },
          html: `<div class="pool-note-error"><i class="bi bi-exclamation-octagon-fill"></i> The role field is required</div>`
        });
        overlayIds.push(overlayId)
      })
      invalidTasks.forEach(element => {
        overlayId = overlays.add(element, {
          position: {
            top: -17,
            right: 32
          },
          html: `<div class="task-note-error"><i class="bi bi-exclamation-octagon-fill"></i></div>`
        });
        overlayIds.push(overlayId)
      })
      setOverlaysError(overlayIds)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setDiagram((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const jsonCreate = (modeler) => {
    let arrUserStories = []
    const elementRegistry = modeler.get('elementRegistry');
    var arrElements = elementRegistry.filter(element => is(element, 'bpmn:Task'));
    arrElements = arrElements.sort((a, b) => {
      return a.id - b.id;
    });

    arrElements.forEach(element => {
      let uh = {
        'id': element.businessObject.id ? element.businessObject.id : "",
        'project': project.name ? project.name : "",
        'name': element.businessObject.name ? element.businessObject.name : "",
        'actor': element.parent.businessObject.name ? element.parent.businessObject.name : "",
        'priority': element.businessObject.get('uh:priority') ? element.businessObject.get('uh:priority') : "",
        'points': element.businessObject.get('uh:points') ? element.businessObject.get('uh:points') : "",
        'purpose': element.businessObject.get('uh:purpose') ? element.businessObject.get('uh:purpose') : "",
        'restrictions': element.businessObject.get('uh:restrictions') ? element.businessObject.get('uh:restrictions') : "",
        'acceptanceCriteria': element.businessObject.get('uh:acceptanceCriteria') ? element.businessObject.get('uh:acceptanceCriteria') : "",
        'dependencies': element.businessObject.get('uh:dependencies') ? element.businessObject.get('uh:dependencies') : [],
        'element': element
      }
      arrUserStories.push(uh)
    });

    return {
      diagramId: diagramId,
      userStories: arrUserStories
    }
  }

  const getProject = async () => {
    try {
      await ProjectService.getProject(projectId).then(res => {
        setProject(res.data)
      });
    } catch (error) {
      // console.log(error)
    }
  }

  const openModalUserStories = () => {
    const modal = new Modal(refModalUserStories.current, options);
    modal.show();
    setModalUserStories(modal);
  }

  const createDependencies = (selectedElement) => {
    const modeling = instanceModeler.get('modeling');
    const arrDependencies = iterElement(selectedElement);
    modeling.updateProperties(selectedElement, {
      'uh:dependencies': arrDependencies
    });

    return arrDependencies;
  }

  const iterElement = (actualElement) => {
    var arrDependencies = [];
    actualElement.incoming.forEach(element => {
      if (is(element.source, 'bpmn:Task')) {
        arrDependencies.push({
          id: element.source.businessObject.id,
          name: element.source.businessObject.name
        })
      } else {
        iterElement(element.source)
      }
    });

    return arrDependencies;
  }

  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        // customRendererModule
      ],
      moddleExtensions: {
        uh: uhExtension
      },
      // keyboard: {
      //   bindTo: document
      // }
    });
    setInstanceModeler(modeler);
    getProject();

    const getData = async () => {
      try {
        const response = await getInfoDiagram(diagramId);
        setDiagram(response.data);
        run(modeler, response.data.xml);
      } catch (error) {
        // console.log(error);
      }
    }

    // Events
    const eventBus = modeler.get('eventBus');
    eventBus.on('commandStack.shape.create.postExecute', (e) => {
      if (is(e.context.shape, 'bpmn:Task')) {
        setNewTask(e.context.shape);
      }
    })
    eventBus.on('commandStack.shape.delete.postExecute', (e) => {
      if (is(e.context.shape, 'bpmn:Task')) {
        createTagUH(modeler, 'Remove Task')
      }
    })

    getData();
  }, [])

  return (
    <>
      <NavBar />
      <div id="model_diagram">
        {/* Options diagram */}
        <div className='d-flex justify-content-between info py-2 px-3'>
          {/* Name and edit */}
          <div className='d-flex alig-items-center'>
            <h3>{diagram.name}</h3>
            <button className='btn border border-white rounded-circle ms-1' data-bs-toggle="modal" data-bs-target="#modalDiagram">
              <i className="bi bi-pencil"></i>
            </button>
          </div>
          <div>
            {/* Button View US */}
            <button className="btn btn-outline-dark me-3" onClick={() => openModalUserStories()}>
              <i className="bi bi-file-earmark-text"></i> View User Stories
            </button>
            {/* Button View US */}
            <button className="btn btn-success me-3" onClick={() => save(instanceModeler)}>
              <i className="bi bi-file-earmark-plus"></i> Create User Stories
            </button>
            {/* Button Save */}
            <button id="save_diagram" className="btn btn-primary" onClick={() => save(instanceModeler)}>
              <i className="bi bi-save"></i> Save
            </button>
          </div>
        </div>

        {/* EBPM */}
        <div id="canvas"></div>
      </div>

      <ModalDiagram mode='Edit' handle={handleChange} name={diagram.name} description={diagram.description} />
      <ModalPropertiesPanel createTagUH={createTagUH} newTask={newTask} setNewTask={setNewTask} selectedElement={selectedElement} createDependencies={createDependencies} modeler={instanceModeler} typeElement={typeElement} modalPropertiesPanel={modalPropertiesPanel} refModalPropertiesElement={refModalPropertiesElement} />
      <ModalUserStories jsonCreate={jsonCreate} createDependencies={createDependencies} modeler={instanceModeler} modalUserStories={modalUserStories} refModalUserStories={refModalUserStories}></ModalUserStories>
      <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
    </>
  )
}
export default ModelerComponent;