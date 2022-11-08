import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDiagram as getInfoDiagram, updateDiagram } from '../../service/DiagramService';
import { addRules } from '../../service/AprioriService';
import { Toast, Modal } from 'bootstrap';
import * as ProjectService from "../../service/ProjectService";

// BPMN
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import uhExtension from '../../resources/userHistory';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import { options } from '@bpmn-io/properties-panel/preact';

// Components
import NavBar from '../NavBar';
import ModalDiagram from './ModalDiagram';
import Alert from '../Alert';
import ModalPropertiesPanel from './ModalPropertiesPanel';
import ModalUserStories from './ModalUserStories';
import ModalPdf from '../pdfbacklog/ModalPdf';


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
  const [modalPdf, setModalPdf] = useState('');
  const [refModalPdf] = useState(React.createRef());
  const [modalUserStories, setModalUserStories] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [typeElement] = useState('uh:props');
  const [newTask, setNewTask] = useState('');
  const [project, setProject] = useState({})
  const [overlaysError, setOverlaysError] = useState([])
  const [overlaysSmart, setOverlaysSmart] = useState([])


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
        createTagSmart(bpmnModeler)
        applyEvents(bpmnModeler)
        setInstanceModeler(bpmnModeler)
      })
    } catch (err) {
      // console.log(err);
    }
  }

  const createTagUH = (bpmnModeler, type) => {
    const modeling = bpmnModeler.get('modeling');
    const overlays = bpmnModeler.get('overlays');
    const elementRegistry = bpmnModeler.get('elementRegistry');
    const tasks = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));

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
        'id': 'US-' + (i + 1),
      })
      overlays.add(element, {
        position: {
          top: -12,
          right: 55
        },
        html: `<div class="task-note">
                  <span class="task-note-text">${element.businessObject.id}</span>
              </div>`
      });
    })
  }

  const createTagSmart = (bpmnModeler) => {
    const overlays = bpmnModeler.get('overlays');
    const elementRegistry = bpmnModeler.get('elementRegistry');
    const tasks = elementRegistry.filter(element => (is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity')) && element.businessObject.get('uh:smart'));
    const smartTags = []
    var overlayId

    // Assign id task
    tasks.forEach((element, i) => {
      overlayId = overlays.add(element, {
        position: {
          bottom: 15,
          right: 15
        },
        html: `<div class="smart-note">
                <span><i class="bi bi-cpu"></i></span>
              </div>`
      });
      smartTags.push({
        overlayId: overlayId,
        taskId: element.businessObject.id
      })
    })

    setOverlaysSmart(smartTags)
  }

  const saveSVG = async (modeler) => {
    try {
      const result = await modeler.saveSVG({ format: true });
      const { svg } = result;

      document.getElementById('imageSVG').innerHTML = svg;
    } catch (error) {
      // console.log(error);
    }
  }

  const save = async (modeler) => {
    const elementRegistry = modeler.get('elementRegistry');
    const overlays = modeler.get('overlays');
    const participants = elementRegistry.filter(element => is(element, 'bpmn:Participant'));
    const tasks = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));
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
        // Update Diagram
        const data = await modeler.saveXML({ format: true });
        const formData = {
          name: diagram.name,
          description: diagram.description,
          xml: data.xml,
          json_user_histories: jsonCreate(modeler),
        }
        await updateDiagram(formData, diagramId);

        // Add Rules - Association Rules
        const arrElements = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));
        var newRules = []
        arrElements.forEach(element => {
          newRules = createAssociationRule(element, element, newRules)
        })
        const res = await addRules(newRules)

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
      return true
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
            right: 55
          },
          html: `<div class="pool-note-error">
                  <span class="me-2"><i class="bi bi-exclamation-octagon-fill"></i></span>
                  <span class="pool-note-error-text">The role field is required</span>
                </div>`
        });
        overlayIds.push(overlayId)
      })
      invalidTasks.forEach(element => {
        overlayId = overlays.add(element, {
          position: {
            top: -17,
            left: -5
          },
          html: `<div class="task-note-error">
                  <span><i class="bi bi-exclamation-octagon-fill"></i></span>
                </div>`
        });
        overlayIds.push(overlayId)
      })
      setOverlaysError(overlayIds)

      return false
    }
  }

  const createAssociationRule = (element, elementSource, rules) => {
    element.outgoing.forEach(elementArrow => {
      if (is(elementArrow.target, 'bpmn:Task') || is(element, 'bpmn:CallActivity')) {
        rules.push([elementSource.businessObject.name.toLowerCase(), elementArrow.target.businessObject.name.toLowerCase()])
      } else {
        createAssociationRule(elementArrow.target, elementSource, rules)
      }
    });

    return rules
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setDiagram((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const jsonCreate = () => {
    let arrUserStories = []
    const elementRegistry = instanceModeler.get('elementRegistry');
    var arrElements = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));
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
        'dependencies': createDependencies(element),
        'element': element
      }
      console.log(uh.dependencies);
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

  const openModalPdf = async () => {
    var open = await save(instanceModeler)
    if (open) {
      const modal = new Modal(refModalPdf.current, options);
      modal.show();
      setModalPdf(modal);
    }
  }

  const createDependencies = (selectedElement) => {
    const modeling = instanceModeler.get('modeling');
    var arrDependencies = []
    arrDependencies = iterElement(selectedElement, arrDependencies);
    modeling.updateProperties(selectedElement, {
      'uh:dependencies': arrDependencies
    });
    return arrDependencies;
  }

  const iterElement = (actualElement, arrDependencies) => {
    actualElement.incoming.forEach(element => {
      if (is(element.source, 'bpmn:Task') || is(element.source, 'bpmn:CallActivity')) {
        arrDependencies.push({
          id: element.source.businessObject.id,
          name: element.source.businessObject.name
        })
      } else {
        iterElement(element.source, arrDependencies)
      }
    });
    return arrDependencies;
  }

  const applyEvents = (modeler) => {
    const eventBus = modeler.get('eventBus');
    const modeling = modeler.get('modeling');
    var idChangeType;
    eventBus.on('commandStack.shape.create.postExecute', async (e) => {
      if (is(e.context.shape, 'bpmn:Task') || is(e.context.shape, 'bpmn:CallActivity')) {
        setNewTask(e.context.shape);
      }
      if (is(e.context.shape, 'bpmn:SubProcess')) {
        idChangeType = e.context.shape.id
        modeling.updateProperties(e.context.shape, {
          'id': 'newElement'
        });
      }
    })
    eventBus.on('commandStack.shape.delete.preExecuted', (e) => {
      if (is(e.context.shape, 'bpmn:Task') || is(e.context.shape, 'bpmn:CallActivity')) {
        modeling.updateProperties(e.context.shape, {
          'id': idChangeType || 'deleteElement'
        });
        idChangeType = 'deleteElement'
      }
    })
    eventBus.on('commandStack.shape.delete.postExecute', (e) => {
      if (is(e.context.shape, 'bpmn:Task') || is(e.context.shape, 'bpmn:CallActivity')) {
        createTagUH(modeler, 'Remove Task')
      }
    })
  }

  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
      ],
      moddleExtensions: {
        uh: uhExtension
      },
      // keyboard: {
      //   bindTo: document
      // }
    });
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
            {/* Button Create PDF US */}
            <button className="btn btn-success me-3" onClick={() => openModalPdf()}>
              <i className="bi bi-file-earmark-plus"></i> Create User Stories
            </button>
            {/* Button Save */}
            <button id="save_diagram" className="btn btn-primary" onClick={() => save(instanceModeler)}>
              <i className="bi bi-save"></i> Save
            </button>
            <button id="save_diagram" className="btn btn-primary ms-3" onClick={() => saveSVG(instanceModeler)}>
              <i className="bi bi-save"></i> Download
            </button>
          </div>
        </div>

        {/* EBPM */}
        <div id="canvas">
        </div>

        <div id="imageSVG"></div>
      </div>

      <ModalDiagram mode='Edit' handle={handleChange} name={diagram.name} description={diagram.description} />
      <ModalPropertiesPanel overlaysSmart={overlaysSmart} setOverlaysSmart={setOverlaysSmart} createTagUH={createTagUH} newTask={newTask} setNewTask={setNewTask} selectedElement={selectedElement} createDependencies={createDependencies} modeler={instanceModeler} typeElement={typeElement} modalPropertiesPanel={modalPropertiesPanel} refModalPropertiesElement={refModalPropertiesElement} />
      <ModalPdf jsonCreate={jsonCreate} modeler={instanceModeler} modalPdf={modalPdf} refModalPdf={refModalPdf}></ModalPdf>
      <ModalUserStories jsonCreate={jsonCreate} createDependencies={createDependencies} modeler={instanceModeler} modalUserStories={modalUserStories} refModalUserStories={refModalUserStories}></ModalUserStories>
      <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
    </>
  )
}
export default ModelerComponent;