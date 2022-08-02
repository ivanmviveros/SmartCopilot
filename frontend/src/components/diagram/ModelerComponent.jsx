
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDiagram as getInfoDiagram, updateDiagram } from '../../service/DiagramService';
import { Toast } from 'bootstrap';

// BPMN
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import customRendererModule from '../../custom';
import qaExtension from '../../resources/qa';
import uhExtension from '../../resources/userHistory';


// Components
import NavBar from '../NavBar';
import ModalDiagram from './ModalDiagram';
import Alert from '../Alert';
import UserHistory from '../userHistory/UserHistory';

function ModelerComponent() {
  const HIGH_PRIORITY = 1500;
  const { diagramId } = useParams();
  const text = document.getElementById('textAttr');
  const userId = sessionStorage.getItem('userId');
  const [instanceModeler, setInstanceModeler] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertElement] = useState(React.createRef());
  const [diagram, setDiagram] = useState({
    name: '',
    description: '',
    xml: '',
  });
  const [userHistory, setUserHistory] = useState({
    activate: true,
    title: '',
    description: '',
    priority: '',
    estimatedTime: '',
    dependencies: '',
  });

  async function run(bpmnModeler, xml) {
    const close = document.getElementById('closeUserHistory')
    const moddle = bpmnModeler.get('moddle'),
        modeling = bpmnModeler.get('modeling');
    let businessObject, user_history
    try {
      await bpmnModeler.importXML(xml).then(() => {
        // Set extension model for ServiceTask Component
        bpmnModeler.on('element.changed', (event) => {
          const element = event.element
          businessObject = getBusinessObject(element);

          if(element.type == 'bpmn2:ServiceTask'){
            const extensionElements = businessObject.extensionElements || moddle.create('bpmn2:extensionElements');
            const props=moddle.create('uh:props');
            console.log(props)
            // extensionElements.get('values').push(props);
            // modeling.updateProperties(element, {
            //   extensionElements,
            //   title:"",
            //   description:"",
            //   estimatedTime:"",
            //   priority:"",
            //   dependecies:""
            // });
          }else {
          }
        })
        // Show information from extension model uh
        bpmnModeler.on('element.contextmenu', HIGH_PRIORITY, (event) => {
          event.originalEvent.preventDefault();
          event.originalEvent.stopPropagation();
          const element = event.element
          if (!element.parent) {
            return;
          }

          close.addEventListener("click", function(){
            console.log("close")
            setUserHistory({
              activate: true,
            })
          })
          
          businessObject = getBusinessObject(element);


          user_history = getExtensionElement(businessObject, 'uh:props');

          setUserHistory({
            activate: false,
            title: user_history.title,
            description: user_history.description,
            priority: user_history.priority,
            estimatedTime: user_history.estimatedTime,
            dependencies: user_history.dependencies,
          })


        })
      })
    } catch (err) {
      // console.log(err);
    }
    function getExtensionElement(element, type) {
      if (!element.extensionElements) {
        return;
      }

      return element.extensionElements.values.filter((extensionElement) => {
        return extensionElement.$instanceOf(type);
      })[0];
    }

  }

  // function to close information about UserHistory card
  const close = () => {
    setUserHistory({
      activate:true
    })
  }
  async function save(modeler) {
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
      const toast = new Toast(alertElement.current);
      toast.show();
    } catch (error) {
      setAlertMessage('Something wrong happened');
      const toast = new Toast(alertElement.current);
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
        customRendererModule
      ],
      moddleExtensions: {
        qa: qaExtension,
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
        <div id="canvas">
          <div className="container">
            <UserHistory  activate={userHistory.activate} title={userHistory.title} description={userHistory.description} priority={userHistory.priority} estimatedTime={userHistory.estimatedTime} dependencies={userHistory.dependencies} />

          </div>
        </div>
      </div>

      <ModalDiagram mode='Edit' handle={handleChange} name={diagram.name} description={diagram.description} />
      <Alert message={alertMessage} alertElement={alertElement} />
    </>
  )
}
export default ModelerComponent;