import Modeler from 'bpmn-js/lib/Modeler';
import { useEffect } from 'react';

// we use stringify to inline an example XML document
import BPMNDiagram_1 from '../resources/diagram.bpmn';

function ModelerComponent() {
  // Get source
  function fetchDiagram(url) {
    return fetch(url).then(response => response.text());
  }


  async function run() {
    // create a modeler
    const modeler = new Modeler({ container: '#canvas' });
    const diagram = await fetchDiagram('https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn')
    // console.log(diagram)
    try {
      await modeler.importXML(diagram);
      // ...
    } catch (err) {
      // ...
    }
  }

  useEffect(() => {
    run();
  },[])

  return (
    <div id="canvas"></div>
    )


}
export default ModelerComponent;