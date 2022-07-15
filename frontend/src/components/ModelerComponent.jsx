import Modeler from 'bpmn-js/lib/Modeler';
import { useEffect } from 'react';
import { API_URL } from '../utils';
import NavBar from './NavBar';

function ModelerComponent() {
  // Get source
  function fetchDiagram(url) {
    return fetch(url).then(response => response.text());
  }
  
  async function run(modeler) {
    // create a modeler
    const url = `${API_URL}/static/xml/pizza-collaboration.bpmn.xml`
    const diagram2 = await fetchDiagram(url)

    try {
      await modeler.importXML(diagram2);
    } catch (err) {
      console.log(err);
    }
  }

  async function save(modeler){
    const data = await modeler.saveXML({ format: true });
    return data.xml
  }

  useEffect(() => {
    const modeler = new Modeler({
      container: '#canvas'
    })

    run(modeler);

    document.getElementById("save_button").addEventListener("click", async function( event ) {
      save(modeler)
    });
  })

  return (
    <>
      <NavBar />
      <div id="canvas"></div>
      <button id="save_button" className='btn btn-success'>Save</button>
    </>
  )
}
export default ModelerComponent;