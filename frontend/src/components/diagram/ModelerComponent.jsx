import Modeler from 'bpmn-js/lib/Modeler';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDiagram as getInfoDiagram, updateDiagram } from '../../service/DiagramService';
import { Toast } from 'bootstrap';

// Components
import NavBar from '../NavBar';
import ModalDiagram from './ModalDiagram';
import Alert from '../Alert';

function ModelerComponent() {
  const { diagramId } = useParams();
  const [instanceModeler, setInstanceModeler] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertElement] = useState(React.createRef());
  const [diagram, setDiagram] = useState({
    name: '',
    description: '',
    xml: '',
  });

  async function run(modeler, xml) {
    try {
      await modeler.importXML(xml);
    } catch (err) {
      // console.log(err);
    }
  }

  async function save(modeler) {
    try {
      const data = await modeler.saveXML({ format: true });
      const formData = {
        name: diagram.name,
        description: diagram.description,
        xml: data.xml,
      }
      await updateDiagram(formData, diagramId);
      setAlertMessage('Guardado exitosamente');
      const toast = new Toast(alertElement.current);
      toast.show();
    } catch (error) {
      setAlertMessage('Se produjo un error al guardar');
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
    const modeler = new Modeler({
      container: '#canvas'
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
      <Alert message={alertMessage} alertElement={alertElement} />
    </>
  )
}
export default ModelerComponent;