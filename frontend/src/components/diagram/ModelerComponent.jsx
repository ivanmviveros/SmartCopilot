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
  const [refAlertElement] = useState(React.createRef());
  const [refModalPropertiesElement] = useState(React.createRef());
  const [selectedElement, setSelectedElement] = useState('');
  const [typeElement] = useState('uh:props');
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
            const modalPropertiesPanel = new Modal(refModalPropertiesElement.current, options);
            modalPropertiesPanel.show();
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
        user_id: userId
      }
      await updateDiagram(formData, diagramId);
      setAlertMessage('Successfully saved');
      const toast = new Toast(refAlertElement.current);
      toast.show();
    } catch (error) {
      setAlertMessage('Something wrong happened');
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
      <ModalPropertiesPanel selectedElement={selectedElement} modeler={instanceModeler} typeElement={typeElement} refModalPropertiesElement={refModalPropertiesElement} />
      <Alert message={alertMessage} refAlertElement={refAlertElement} />
    </>
  )
}
export default ModelerComponent;