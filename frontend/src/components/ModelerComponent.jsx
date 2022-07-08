import Modeler from 'bpmn-js/lib/Modeler';

// we use stringify to inline an example XML document
import BPMNDiagram_1 from '../Resources/diagram.bpmn';


// make sure you added bpmn-js to your your project
// dependencies via npm install --save bpmn-js
import BpmnViewer from 'bpmn-js';
function ModelerComponent(){

var viewer = new BpmnViewer({
  container: '#canvas'
});


viewer.importXML(BPMNDiagram_1).then(function(result) {

  const { warnings } = result;

  console.log('success !', warnings);

  viewer.get('canvas').zoom('fit-viewport');
}).catch(function(err) {

  const { warnings, message } = err;

  console.log('something went wrong:', warnings, message);
});

}
export default ModelerComponent;