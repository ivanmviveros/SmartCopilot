import Modeler from 'bpmn-js/lib/Modeler';

// we use stringify to inline an example XML document
import BPMNDiagram_1 from '../resources/diagram.bpmn';
import ReactDOM from 'react-dom/client';


function ModelerComponent(){
  const canvas = document.getElementById('canvas');

// create a modeler
const modeler = new Modeler({ 
  container: canvas,
  keyboard: {
    bindTo: window
  }

});

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