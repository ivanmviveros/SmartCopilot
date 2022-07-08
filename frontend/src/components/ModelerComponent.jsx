import Modeler from 'bpmn-js/lib/Modeler';

// we use stringify to inline an example XML document
import BPMNDiagram_1 from '../resources/diagram.bpmn';
import ReactDOM from 'react-dom/client';

function ModelerComponent() {

  // create a modeler
  const modeler = new Modeler({ container: '#canvas' });

  // Get source
  function fetchDiagram(url) {
    return fetch(url).then(response => response.text());
  }

  async function run() {
    const diagram = await fetchDiagram('https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn')
    // console.log(diagram)
    try {
      await modeler.importXML(diagram);
      // ...
    } catch (err) {
      // ...
    }
  }
  run();



// Get source
function fetchDiagram(url) {
  return fetch(url).then(response => response.text());
}

async function run() {
  console.log(BPMNDiagram_1)
  // const diagram = await fetchDiagram('../resources/diagram.bpmn');
  try {
    await modeler.importXML('../resources/diagram.bpmn');
    // ...
  } catch (err) {
    // ...
  }
}
run();
// return (
//   <div className="" id="canvas"></div>
// )
}
export default ModelerComponent;