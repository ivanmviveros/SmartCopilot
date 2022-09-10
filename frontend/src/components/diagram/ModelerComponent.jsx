import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDiagram as getInfoDiagram, updateDiagram } from '../../service/DiagramService';
import { Toast, Modal } from 'bootstrap';

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

function ModelerComponent() {
  const HIGH_PRIORITY = 1500;
  const { diagramId } = useParams();
  const userId = sessionStorage.getItem('userId');
  const [instanceModeler, setInstanceModeler] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [refAlertElement] = useState(React.createRef());
  const [refModalPropertiesElement] = useState(React.createRef());
  const [selectedElement, setSelectedElement] = useState('');
  const [typeElement] = useState('uh:props');
  const [modalPropertiesPanel, setModalPropertiesPanel] = useState('');
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
      })
    } catch (err) {
      // console.log(err);
    }
  }

  const save = async (modeler) => {
    try {
      const data = await modeler.saveXML({ format: true });
      const formData = {
        name: diagram.name,
        description: diagram.description,
        xml: data.xml,
        user_id: userId,
        json_user_histories: JSON.stringify(jsonCreate(modeler))
      }
      console.log(formData.json_user_histories)
      await updateDiagram(formData, diagramId);
      setAlertMessage('Successfully saved');
      setAlertType('Success');
      const toast = new Toast(refAlertElement.current);
      toast.show();
    } catch (error) {
      setAlertMessage('Something wrong happened');
      setAlertType('Error');
      const toast = new Toast(refAlertElement.current);
      toast.show();
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
    let arrUserHistories = []
  
    const arrElements = modeler._definitions.diagrams[0].plane.bpmnElement.flowElements
    arrElements.forEach((element,index) => {
      if(element.$type == "bpmn:Task"){
        let uh = {
          'id' : "uh" + index,
          'name' : element.name? element.name:"",
          'description' : element.description?element.description:"",
          'estimatedTime' : element.estimatedTime?element.estimatedTime:"",
          'priority' : element.priority?element.priority:"",
          'dependencies': element.dependencies?element.dependencies:""
        }
        arrUserHistories.push(uh)
      }
    })
    return {
      diagram: diagramId,
      userHistories : arrUserHistories
    }
  }


  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        customRendererModule
      ],
      moddleExtensions: {
        uh: uhExtension
      }
    });
    setInstanceModeler(modeler);

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
          {/* Button Save */}
          <button id="save_diagram" className="btn btn-primary" onClick={() => save(instanceModeler)}>
            <i className="bi bi-save"></i> Save
          </button>
        </div>

        {/* EBPM */}
        <div id="canvas"></div>
      </div>

      <ModalDiagram mode='Edit' handle={handleChange} name={diagram.name} description={diagram.description} />
      <ModalPropertiesPanel selectedElement={selectedElement} modeler={instanceModeler} typeElement={typeElement} modalPropertiesPanel={modalPropertiesPanel} refModalPropertiesElement={refModalPropertiesElement} />
      <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
    </>
  )
}
export default ModelerComponent;