import Modeler from 'bpmn-js/lib/Modeler';
import { useEffect } from 'react';
import { API_URL } from '../utils';

function ModelerComponent() {
  // Get source
  function fetchDiagram(url) {
    return fetch(url).then(response => response.text());
  }

  async function run() {
    // create a modeler
    const modeler = new Modeler({ container: '#canvas' });
    
    const url = `${API_URL}/static/xml/pizza-collaboration.bpmn.xml`
    const diagram2 = await fetchDiagram(url)

    try {
      await modeler.importXML(diagram2);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    run();
  })

  return (
    <div id="canvas"></div>
  )
}
export default ModelerComponent;